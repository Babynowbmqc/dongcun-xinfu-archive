# Dongcun Xinfu Shanzhai Chaoshan Opera Troupe

The bilingual living-archive website of **Dongcun Xinfu Shanzhai Chaoshan Opera Troupe / 东村新妇山寨剧团**.

Live site: [dongcun-xinfu.popoqst.chatgpt.site](https://dongcun-xinfu.popoqst.chatgpt.site)

This project rebuilds the troupe’s public Are.na archive as a standalone Chinese–English website while preserving the original channel and block order. It includes a one-click language switch, an animated stage entrance, and a visual system drawn from the troupe’s photographs and textile materials.

## 本地运行 / Local development

Requirements:

- Node.js 22.13 or newer
- pnpm

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in a browser.

Before submitting changes:

```bash
pnpm build
```

## 项目结构 / Project structure

- `app/page.tsx` — main archive interface and bilingual interactions
- `app/globals.css` — layout, responsive design, animation, and visual system
- `app/arena-data.json` — bilingual snapshot of the public Are.na archive
- `public/arena/` — troupe photographs used by the interface
- `public/textures/` — original textile materials
- `scripts/sync_arena.py` — archive synchronization helper

## 参与修改 / Contributing

Suggestions, accessibility improvements, translation corrections, responsive refinements, and visual polish are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), create a branch, and submit a Pull Request rather than pushing directly to `main`.

## License and cultural materials

The website’s source code is released under the [MIT License](LICENSE).

The MIT License does **not** cover archive writing, translations, photographs, video, audio, artworks, performance documentation, the troupe’s name or identity, or the textile images `01.png` and `02.png`. Those materials remain the property of Dongcun Xinfu, their respective authors, performers, photographers, and contributors. They may be used inside contributions to this website, but may not be reused elsewhere without permission.

---

本网站代码以 MIT 协议开源。档案文字、翻译、照片、影像、声音、作品、演出记录、剧团名称与身份，以及 `01.png`、`02.png` 布料图片不包含在 MIT 授权中，版权归东村新妇及相应作者、表演者、摄影者和贡献者所有。它们可以在本网站的协作修改中继续使用，但未经许可不得挪作他用。
