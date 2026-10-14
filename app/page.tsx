'use client';

import { useEffect, useMemo, useState } from 'react';
import archiveData from './arena-data.json';

type Language = 'en' | 'zh';
type Localized = { en: string; zh: string };
type ArchiveImage = { src: string; width?: number; height?: number; alt?: string };
type ArchiveBlock = {
  id: number;
  type: string;
  title: Localized;
  description: Localized;
  text?: Localized;
  image?: ArchiveImage;
  source?: { url: string; provider: string };
  attachment?: { url: string; contentType: string; filename: string };
  channelSlug?: string;
  count?: number;
};
type ArchiveChannel = {
  id: number;
  slug: string;
  title: Localized;
  description: Localized;
  count: number;
  cover?: ArchiveImage | null;
  blocks: ArchiveBlock[];
};

const mainChannels = archiveData.channels as ArchiveChannel[];
const nestedChannels = archiveData.nestedChannels as Record<string, ArchiveChannel>;
const placeholderTones = ['tone-rose', 'tone-sage', 'tone-straw', 'tone-blue'] as const;

const copy = {
  en: {
    archive: 'Live archive',
    intro: 'An open-source, itinerant Shanzhai Chaoshan opera troupe rooted in Dongcun — copying, sewing, learning, drifting and making a stage wherever we land.',
    enter: 'Enter the archive ↓',
    about: 'About the troupe',
    aboutBody: 'Dongcun Xinfu works through imperfect copying. We learn from living Chaoshan opera and iron-rod puppetry, build low-tech stages, recruit locally, and let every stop rewrite the troupe.',
    arenaDoor: 'Complete archive on Are.na',
    instagramDoor: 'Dongcun Xinfu on Instagram',
    channel: 'Channel',
    blocks: 'blocks',
    close: 'Close',
    back: 'Back',
    empty: 'This channel is open and waiting for its first block.',
    readMore: 'Read complete text',
    readLess: 'Collapse text',
    openSource: 'Open external source ↗',
    openFile: 'Open file ↗',
    nested: 'Open nested channel →',
    fieldNote: 'FIELD NOTE 001 · PUPPET STAGE, CHAOSHAN',
    workingTranslation: 'Chinese originals / English working translations',
  },
  zh: {
    archive: '活的档案',
    intro: '一个扎根潮汕东村、开源且持续漂流的山寨潮剧团：临摹、缝纫、学习、上路，在每一次停靠的地方重新搭起戏台。',
    enter: '进入档案 ↓',
    about: '关于剧团',
    aboutBody: '东村新妇以“不完整的临摹”工作。我们向活着的潮剧与铁枝木偶戏学习，搭建低技术舞台，沿途公开招募，让每一站重新改写剧团。',
    arenaDoor: 'Are.na 整体档案',
    instagramDoor: '东村新妇 Instagram',
    channel: '频道',
    blocks: '个区块',
    close: '关闭',
    back: '返回',
    empty: '这个频道已经打开，正在等待第一个区块。',
    readMore: '阅读全文',
    readLess: '收起正文',
    openSource: '打开外部来源 ↗',
    openFile: '打开文件 ↗',
    nested: '打开嵌套频道 →',
    fieldNote: 'FIELD NOTE 001 · 潮汕木偶戏台',
    workingTranslation: '中文原文 / 英文工作译文',
  },
};

function syncedLabel(language: Language) {
  const date = new Date(`${archiveData.syncedAt}T00:00:00+08:00`);
  const formatted = new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-GB', {
    day: 'numeric',
    month: language === 'zh' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).format(date);
  return language === 'zh' ? `档案快照 · ${formatted}` : `Archive snapshot · ${formatted}`;
}

function text(value: Localized | undefined, language: Language) {
  if (!value) return '';
  return value[language] || value.zh || value.en;
}

function youtubeEmbed(url: string) {
  try {
    const parsed = new URL(url);
    let id = '';
    if (parsed.hostname.includes('youtu.be')) id = parsed.pathname.slice(1);
    if (parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.split('/')[2] || '';
    if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) id = parsed.searchParams.get('v') || '';
    if (!id) return null;
    const start = parsed.searchParams.get('t')?.replace(/\D/g, '') || '';
    return `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ''}`;
  } catch {
    return null;
  }
}

function LanguageSwitch({ language, onChange, compact = false }: { language: Language; onChange: () => void; compact?: boolean }) {
  return (
    <button className={`language-switch${compact ? ' compact' : ''}`} onClick={onChange} aria-label="Switch between English and Chinese">
      <span className={language === 'en' ? 'active' : ''}>EN</span>
      <b>/</b>
      <span className={language === 'zh' ? 'active' : ''}>中</span>
    </button>
  );
}

function TextBlock({ block, language }: { block: ArchiveBlock; language: Language }) {
  const value = text(block.text, language);
  const [expanded, setExpanded] = useState(value.length < 900);
  const paragraphs = value.split(/\n\s*\n/).filter(Boolean);
  const visible = expanded ? paragraphs : paragraphs.slice(0, 3);

  return (
    <article className="archive-block text-block">
      {text(block.title, language) && <h3>{text(block.title, language)}</h3>}
      <div className={!expanded ? 'text-content clipped' : 'text-content'}>
        {visible.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      {value.length >= 900 && (
        <button className="text-toggle" onClick={() => setExpanded((current) => !current)}>
          {expanded ? copy[language].readLess : copy[language].readMore}
        </button>
      )}
    </article>
  );
}

function MediaCaption({ block, language }: { block: ArchiveBlock; language: Language }) {
  const title = text(block.title, language);
  const description = text(block.description, language);
  if (!title && !description) return null;
  return (
    <div className="media-caption">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
    </div>
  );
}

function BlockCard({ block, language, openNested }: { block: ArchiveBlock; language: Language; openNested: (slug: string) => void }) {
  if (block.type === 'Text' && block.text) return <TextBlock key={`${block.id}-${language}`} block={block} language={language} />;

  if (block.type === 'Channel' && block.channelSlug) {
    return (
      <button className="archive-block nested-block" onClick={() => openNested(block.channelSlug!)}>
        <span>{String(block.count || 0).padStart(2, '0')} {copy[language].blocks}</span>
        <h3>{text(block.title, language)}</h3>
        <b>{copy[language].nested}</b>
      </button>
    );
  }

  const embedUrl = block.source?.url ? youtubeEmbed(block.source.url) : null;
  const contentType = block.attachment?.contentType || '';
  const isVideo = contentType.startsWith('video/');
  const isAudio = contentType.startsWith('audio/');
  const isPdf = contentType === 'application/pdf';

  return (
    <article className={`archive-block media-block type-${block.type.toLowerCase()}`}>
      {embedUrl ? (
        <div className="video-frame"><iframe src={embedUrl} title={text(block.title, language) || 'Video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
      ) : isVideo && block.attachment ? (
        <video controls preload="metadata" poster={block.image?.src}><source src={block.attachment.url} type={contentType} /></video>
      ) : isAudio && block.attachment ? (
        <div className="audio-card">{block.image && <img src={block.image.src} alt={text(block.title, language)} loading="lazy" />}<audio controls preload="metadata"><source src={block.attachment.url} type={contentType} /></audio></div>
      ) : isPdf && block.attachment ? (
        <iframe className="pdf-frame" src={block.attachment.url} title={text(block.title, language) || 'PDF'} />
      ) : block.image ? (
        <img className="block-image" src={block.image.src} alt={block.image.alt || text(block.title, language)} loading="lazy" />
      ) : null}
      <MediaCaption block={block} language={language} />
      <div className="block-actions">
        {block.source?.url && !embedUrl && <a href={block.source.url} target="_blank" rel="noreferrer">{copy[language].openSource}</a>}
        {block.attachment && !isVideo && !isAudio && !isPdf && <a href={block.attachment.url} target="_blank" rel="noreferrer">{copy[language].openFile}</a>}
      </div>
    </article>
  );
}

function ChannelView({ channel, language, onLanguage, onClose, onBack, canGoBack, onOpenNested }: {
  channel: ArchiveChannel;
  language: Language;
  onLanguage: () => void;
  onClose: () => void;
  onBack: () => void;
  canGoBack: boolean;
  onOpenNested: (slug: string) => void;
}) {
  const mainIndex = mainChannels.findIndex((item) => item.slug === channel.slug);
  return (
    <div className="channel-overlay" role="dialog" aria-modal="true" aria-label={text(channel.title, language)}>
      <header className="channel-bar">
        <div>{canGoBack ? <button onClick={onBack}>← {copy[language].back}</button> : <span>{copy[language].channel} {String(mainIndex + 1).padStart(2, '0')}</span>}</div>
        <LanguageSwitch language={language} onChange={onLanguage} compact />
        <button onClick={onClose}>{copy[language].close} ×</button>
      </header>
      <main className="channel-page">
        <div className="channel-heading">
          <p>{String(channel.count).padStart(2, '0')} {copy[language].blocks}</p>
          <h2>{text(channel.title, language)}</h2>
          {text(channel.description, language) && <div className="channel-description">{text(channel.description, language)}</div>}
        </div>
        {channel.blocks.length ? (
          <div className="blocks-grid">
            {channel.blocks.map((block) => <BlockCard key={`${channel.slug}-${block.id}`} block={block} language={language} openNested={onOpenNested} />)}
          </div>
        ) : <p className="empty-channel">{copy[language].empty}</p>}
      </main>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [channelStack, setChannelStack] = useState<string[]>([]);
  const selectedSlug = channelStack[channelStack.length - 1];
  const allChannels = useMemo(() => ({ ...Object.fromEntries(mainChannels.map((channel) => [channel.slug, channel])), ...nestedChannels }), []);
  const selectedChannel = selectedSlug ? allChannels[selectedSlug] : undefined;

  const toggleLanguage = () => setLanguage((current) => current === 'en' ? 'zh' : 'en');
  const openChannel = (slug: string, nested = false) => {
    setChannelStack((current) => nested ? [...current, slug] : [slug]);
    window.history.replaceState(null, '', `#${slug}`);
  };
  const closeChannel = () => {
    setChannelStack([]);
    window.history.replaceState(null, '', '#archive');
  };
  const backChannel = () => setChannelStack((current) => current.slice(0, -1));

  useEffect(() => {
    window.localStorage.setItem('dongcun-language', language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  useEffect(() => {
    document.body.style.overflow = selectedChannel ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedChannel]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedChannel) closeChannel();
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [selectedChannel]);

  return (
    <>
      <div className="stage-intro" aria-hidden="true">
        <div className="stage-intro-panel stage-intro-left"><img src="/arena/371.jpg" alt="" /></div>
        <div className="stage-intro-panel stage-intro-right"><img src="/arena/371.jpg" alt="" /></div>
        <div className="stage-intro-title"><span>入场 / ENTER</span><strong>DONGCUN XINFU</strong></div>
      </div>

      <header className="topbar">
        <a className="wordmark" href="#top">DONGCUN XINFU SHANZHAI CHAOSHAN OPERA TROUPE</a>
        <nav><a href="#archive">{copy[language].archive}</a><a href="#about">{copy[language].about}</a></nav>
        <LanguageSwitch language={language} onChange={toggleLanguage} />
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">OPEN-SOURCE / ITINERANT / SHANZHAI</p>
            <h1><span>DONGCUN XINFU</span><span>SHANZHAI</span><span>CHAOSHAN OPERA</span><span>TROUPE</span></h1>
            <p className="intro">{copy[language].intro}</p>
            <a className="enter-link" href="#archive">{copy[language].enter}</a>
          </div>
          <figure className="hero-image-wrap">
            <img className="hero-image" src="/arena/371.jpg" alt="Puppets resting on a small Chaoshan opera stage" />
            <figcaption><span>{copy[language].fieldNote}</span><span>371.JPG</span></figcaption>
          </figure>
        </section>

        <div className="ticker" aria-hidden="true"><div>{Array.from({ length: 6 }).map((_, index) => <span key={index}>COPY <i>✦</i> SEW <i>✦</i> DRIFT <i>✦</i> PERFORM <i>✦</i> 山寨 <i>✦</i> 潮剧 <i>✦</i></span>)}</div></div>

        <section className="archive-section" id="archive">
          <div className="section-heading">
            <div><p className="section-kicker">ARE.NA STRUCTURE / LOCAL ARCHIVE</p><h2>{copy[language].archive}</h2></div>
            <p>{syncedLabel(language)}<br />{copy[language].workingTranslation}</p>
          </div>
          <div className="channel-list">
            {mainChannels.map((channel, index) => (
              <button className="channel-card" key={channel.slug} onClick={() => openChannel(channel.slug)}>
                <div className={`channel-cover ${channel.cover ? '' : placeholderTones[index % placeholderTones.length]}`}>
                  {channel.cover && <img src={channel.cover.src} alt="" loading="lazy" />}
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="channel-meta">
                  <h3>{text(channel.title, language)}</h3>
                  <p>{String(channel.count).padStart(2, '0')} {copy[language].blocks} <b>↗</b></p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="about" id="about">
          <div className="about-cloth"><img src="/arena/bed-stage.jpg" alt="A temporary Dongcun Xinfu stage made from a bed" loading="lazy" /></div>
          <div className="about-copy"><p className="section-kicker">SHANZHAI IS A METHOD</p><h2>{copy[language].about}</h2><p>{copy[language].aboutBody}</p></div>
        </section>

        <section className="external-gates" aria-label="External links">
          <a href="https://www.are.na/m4a6blpm_hc" target="_blank" rel="noreferrer">
            <span>01</span><strong>{copy[language].arenaDoor}</strong><b>↗</b>
          </a>
          <a href="https://instagram.com/dongcunxinfu?psln=MXg0enRqNm81eWN4aw%3D%3D" target="_blank" rel="noreferrer">
            <span>02</span><strong>{copy[language].instagramDoor}</strong><b>↗</b>
          </a>
        </section>
      </main>

      <footer><strong>DONGCUN XINFU</strong><p>DONGCUN XINFU SHANZHAI CHAOSHAN OPERA TROUPE</p><span>{syncedLabel(language)}</span></footer>

      {selectedChannel && (
        <ChannelView
          channel={selectedChannel}
          language={language}
          onLanguage={toggleLanguage}
          onClose={closeChannel}
          onBack={backChannel}
          canGoBack={channelStack.length > 1}
          onOpenNested={(slug) => openChannel(slug, true)}
        />
      )}
    </>
  );
}
