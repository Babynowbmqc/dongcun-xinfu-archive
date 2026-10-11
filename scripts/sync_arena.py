#!/usr/bin/env python3
"""Build the local bilingual archive data file from public Are.na JSON.

The site never sends visitors to an Are.na page. Public media files remain at
their source CDN URLs; the channel structure and all readable copy are stored
locally in app/arena-data.json.
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = Path(os.environ.get("ARENA_RAW_DIR", "/tmp/arena-channels-current"))
GROUP_DIR = Path(os.environ.get("ARENA_GROUP_DIR", "/tmp"))
OUTPUT = ROOT / "app" / "arena-data.json"
CACHE = ROOT / "data" / "translation-cache.json"

CHANNEL_TITLES = {
    "diy-ntbkcndip_c": "DIY Folk Customs",
    "mvlumotvknk": "Making Trouble (I Forgot How to Pee)",
    "s4h5myklzqk": "Recess · Dongcun",
    "xjvmz46qdlu": "Drifting Diary",
    "eocf6-8gmo": "Recruitment",
    "ual29kre6zs": "Giving Birth to a Tiny Stage",
    "uks6vfxhglq": "Shanzhai Five Blessings in a Row",
    "mfa-djprgebbyk0": "Recess · Shanzhai MFA",
    "6bqrhwceib8": "Xin Zhengshun Iron-Rod Puppet Troupe",
    "l8o1zlnxwks": "Plays Written from Every Member’s Dreams",
    "uwfpldemva": "Shenzhen Stop",
    "brj8guwity0": "Shanzhai Ethics Class",
    "dongcun-xinfu-experimental-theatre": "Dongcun Xinfu Experimental Theatre",
    "cheruby-qay2rbmlcco": "CHERUBY Recruitment Materials",
    "3jd24s77f_k": "Puppet Making",
    "axxmd83g7fm": "🚛 Wenzhou Stop",
    "6td9vb8dm7g": "🎵 Dongcun International Philharmonic",
    "essrtdg7kr8": "Parallel Dongcun",
    "dash-fezvn9_hysq": "Shanghai Stop — Rockbund Art Museum",
    "fb3qxbu3gfw": "🪡 Dongcun Beauty Detox Center",
    "8pqtd7p5oa4": "Performance",
    "42_jsfir_g8": "Troupe Leader Li Jiena",
    "we0e-wnt-fu": "Beauty Detox Manifesto",
}

EXACT_TRANSLATIONS = {
    "东村新妇山寨剧团": "Dongcun Xinfu Shanzhai Teochew Opera Troupe",
    "东村新妇潮剧团": "Dongcun Xinfu Shanzhai Teochew Opera Troupe",
}


def plain(value: Any) -> str:
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, dict):
        return str(value.get("markdown") or value.get("plain") or "").strip()
    return ""


def has_chinese(value: str) -> bool:
    return bool(re.search(r"[\u3400-\u9fff]", value))


def load_cache() -> dict[str, str]:
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def translator():
    from argostranslate import translate  # type: ignore

    installed = translate.get_installed_languages()
    zh = next(item for item in installed if item.code == "zh")
    en = next(item for item in installed if item.code == "en")
    return zh.get_translation(en)


def collect_strings(channels: list[dict[str, Any]], nested: dict[str, dict[str, Any]]) -> list[str]:
    values: list[str] = []
    for channel in [*channels, *nested.values()]:
        values.extend([plain(channel.get("title")), plain(channel.get("description"))])
        for block in channel.get("data", []):
            values.extend(
                [
                    plain(block.get("title")),
                    plain(block.get("description")),
                    plain(block.get("content")),
                ]
            )
    return list(dict.fromkeys(value for value in values if value and has_chinese(value)))


def translate_all(strings: list[str], cache: dict[str, str]) -> dict[str, str]:
    cache.update(EXACT_TRANSLATIONS)
    missing = [value for value in strings if value not in cache]
    if not missing:
        return cache
    engine = translator()
    for index, value in enumerate(missing, 1):
        # The offline engine handles paragraphs more reliably than extremely
        # long documents. Preserve blank-line rhythm while translating chunks.
        paragraphs = re.split(r"(\n\s*\n)", value)
        rendered: list[str] = []
        for paragraph in paragraphs:
            if not paragraph.strip():
                rendered.append(paragraph)
                continue
            chunks = [paragraph[i : i + 1800] for i in range(0, len(paragraph), 1800)]
            rendered.append(" ".join(engine.translate(chunk) for chunk in chunks))
        cache[value] = "".join(rendered).strip()
        print(f"translated {index}/{len(missing)}", flush=True)
        if index % 10 == 0:
            CACHE.parent.mkdir(parents=True, exist_ok=True)
            CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    return cache


def pair(value: Any, cache: dict[str, str], override: str | None = None) -> dict[str, str]:
    zh = plain(value)
    if not zh:
        return {"zh": "", "en": ""}
    if override:
        en = override
    elif has_chinese(zh):
        en = cache.get(zh, zh)
    else:
        en = zh
    return {"zh": zh, "en": en}


def image_data(block: dict[str, Any]) -> dict[str, Any] | None:
    image = block.get("image") or {}
    if not image:
        return None
    rendition = image.get("large") or image.get("medium") or {}
    src = rendition.get("src") or image.get("src")
    if not src:
        return None
    return {
        "src": src,
        "width": image.get("width") or rendition.get("width"),
        "height": image.get("height") or rendition.get("height"),
        "alt": image.get("alt_text") or "",
    }


def clean_block(block: dict[str, Any], cache: dict[str, str]) -> dict[str, Any]:
    block_type = block.get("type") or "Block"
    title_override = None
    if block_type == "Channel":
        title_override = CHANNEL_TITLES.get(str(block.get("slug")))
    item: dict[str, Any] = {
        "id": block.get("id"),
        "type": block_type,
        "title": pair(block.get("title"), cache, title_override),
        "description": pair(block.get("description"), cache),
        "createdAt": block.get("created_at"),
    }
    text = pair(block.get("content"), cache)
    if text["zh"]:
        item["text"] = text
    image = image_data(block)
    if image:
        item["image"] = image
    source = block.get("source") or {}
    if source.get("url"):
        item["source"] = {
            "url": source.get("url"),
            "provider": ((source.get("provider") or {}).get("name") or "External source"),
        }
    attachment = block.get("attachment") or {}
    if attachment.get("url"):
        item["attachment"] = {
            "url": attachment.get("url"),
            "contentType": attachment.get("content_type") or "application/octet-stream",
            "filename": attachment.get("filename") or "attachment",
        }
    if block_type == "Channel":
        item["channelSlug"] = block.get("slug")
        item["count"] = (block.get("counts") or {}).get("contents", 0)
    return item


def clean_channel(channel: dict[str, Any], cache: dict[str, str]) -> dict[str, Any]:
    slug = str(channel.get("slug") or "")
    blocks = [clean_block(block, cache) for block in channel.get("data", [])]
    cover = next((block.get("image") for block in blocks if block.get("image")), None)
    return {
        "id": channel.get("id"),
        "slug": slug,
        "title": pair(channel.get("title"), cache, CHANNEL_TITLES.get(slug)),
        "description": pair(channel.get("description"), cache),
        "count": len(blocks),
        "cover": cover,
        "blocks": blocks,
    }


def load_main_channels() -> list[dict[str, Any]]:
    channel_blocks: list[dict[str, Any]] = []
    for page in range(1, 5):
        path = GROUP_DIR / f"arena-current-{page}.json"
        channel_blocks.extend(
            block for block in json.loads(path.read_text(encoding="utf-8"))["data"] if block.get("type") == "Channel"
        )
    channels: list[dict[str, Any]] = []
    for channel in channel_blocks:
        path = RAW_DIR / f"{channel['slug']}.json"
        payload = json.loads(path.read_text(encoding="utf-8"))
        data = payload.get("data", [])
        if channel["slug"] == "essrtdg7kr8":
            page_two = RAW_DIR / "essrtdg7kr8-page2.json"
            if page_two.exists():
                data += json.loads(page_two.read_text(encoding="utf-8")).get("data", [])
        channels.append({**channel, "data": data})
    return channels


def load_nested_channels(channels: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    nested: dict[str, dict[str, Any]] = {}
    main_slugs = {channel["slug"] for channel in channels}
    for channel in channels:
        for block in channel.get("data", []):
            if block.get("type") != "Channel" or block.get("slug") in main_slugs:
                continue
            slug = str(block.get("slug"))
            path = RAW_DIR / f"nested-{slug}.json"
            nested[slug] = {**block, "data": json.loads(path.read_text(encoding="utf-8")).get("data", []) if path.exists() else []}
    return nested


def main() -> None:
    channels = load_main_channels()
    nested = load_nested_channels(channels)
    cache = translate_all(collect_strings(channels, nested), load_cache())
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    payload = {
        "syncedAt": "2026-10-12",
        "sourceUpdatedAt": "2026-10-12",
        "channels": [clean_channel(channel, cache) for channel in channels],
        "nestedChannels": {slug: clean_channel(channel, cache) for slug, channel in nested.items()},
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {OUTPUT} with {len(payload['channels'])} channels", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"sync failed: {exc}", file=sys.stderr)
        raise
