'use client';

import { useEffect, useState } from 'react';

type Language = 'en' | 'zh';
type Filter = 'all' | 'practice' | 'school' | 'journey';

type Project = {
  id: string;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  category: Exclude<Filter, 'all'>;
  date: string;
  count: number;
  image?: string;
  accent: 'pink' | 'red' | 'lime' | 'blue';
};

type Article = {
  number: string;
  title: { en: string; zh: string };
  dek: { en: string; zh: string };
  body: { en: string[]; zh: string[] };
};

const filters: { id: Filter; en: string; zh: string }[] = [
  { id: 'all', en: 'All channels', zh: '全部频道' },
  { id: 'practice', en: 'Theatre & folk practice', zh: '剧场与民俗实践' },
  { id: 'school', en: 'Shanzhai school', zh: '山寨学校' },
  { id: 'journey', en: 'Stations & journeys', zh: '站点与漂流' },
];

const projects: Project[] = [
  {
    id: 'parallel-dongcun',
    title: { en: 'Parallel Dongcun', zh: '平行东村' },
    description: {
      en: 'Dongcun can be any ordinary village. “Xinfu” can be any group of strong, tearful women trying bizarre ways to survive. A sewing co-op, banner clothes, air films—and a tiny stage that wants to drift.',
      zh: '潮汕东村可以是无数个全球化的普通村子，“新妇”可以是任何普通村子里一群会哭泣的强壮女人，为寻找生存门道干过的所有奇葩事。缝纫合作社、横幅衣服、空气电影，以及一个真正想漂流起来的小舞台。',
    },
    category: 'practice', date: '2021—NOW', count: 107, image: '/arena/rehearsal.jpg', accent: 'red',
  },
  {
    id: 'diy-folk',
    title: { en: 'DIY Folk Customs', zh: 'DIY 民俗' },
    description: {
      en: 'Folk custom is treated as a living verb: copied, misread, repaired and performed again with whatever is close at hand.',
      zh: '把民俗当作一个活着的动词：复制、误读、修补，再用手边现成的一切重新演一遍。',
    },
    category: 'practice', date: '2026', count: 77, image: '/arena/fire-ritual.jpg', accent: 'pink',
  },
  {
    id: 'making-trouble',
    title: { en: 'Making Trouble (I Forgot How to Pee)', zh: '制造麻烦（我忘记怎么尿尿了）' },
    description: {
      en: 'A children’s workshop and performance about forgetting the rules assigned to bodies. Draw a picture, sew an angel doll, invent a home, then let the dolls take the stage.',
      zh: '一个关于暂时忘记身体规则的儿童工作坊与演出：先画画，再缝一个天使娃娃，发明一个家，最后让娃娃们登上舞台。',
    },
    category: 'school', date: '2026', count: 14, image: '/arena/angel-dolls.jpg', accent: 'blue',
  },
  {
    id: 'recess',
    title: { en: 'Recess', zh: '大课间' },
    description: {
      en: 'An open interval for games, rituals, conversations and impulses that spill out of rehearsal. The set changes, the actors switch roles, and the story starts over.',
      zh: '面向栏杆外的家长、亲友与路人的课间游戏和仪式，也是消化排练中即兴表演欲望与对话的时段。布景重搭、角色转换、故事重新再讲一遍。',
    },
    category: 'school', date: '2026', count: 12, image: '/arena/school-poster.jpg', accent: 'lime',
  },
  {
    id: 'relay-playwriting',
    title: { en: 'Relay Playwriting During Recess', zh: '大课间接力编剧' },
    description: {
      en: 'A script passed from one hand to another: a longer break in which everyone can adjust the scene, occupy a role, or sit down and read again.',
      zh: '一份从一双手传给另一双手的剧本：在更长的调整时间里，每个人都可以重新制景、进入角色，或者坐下来再读一遍。',
    },
    category: 'school', date: '2026', count: 3, accent: 'pink',
  },
  {
    id: 'xinzhengshun',
    title: { en: 'Xin Zheng Shun Iron-Rod Puppetry Troupe', zh: '新正顺铁枝木偶戏团' },
    description: {
      en: 'A living folk troupe in Chaoshan and Dongcun Xinfu’s principal shanzhai teacher. The interest is not only technique, but how a troupe makes life possible for the people inside it.',
      zh: '一个活跃于潮汕民俗现场的老爷戏剧团，也是东村新妇主要的山寨对象。我们学习的不只是技艺，更是剧团里的人如何在共同度过的时间中寻找自己的位置与生存方式。',
    },
    category: 'practice', date: '30+ YEARS', count: 17, image: '/arena/backstage.jpg', accent: 'red',
  },
  {
    id: 'puppet-making',
    title: { en: 'Puppet Making', zh: '人形制作' },
    description: {
      en: 'Cloth doubles carrying their makers’ wishes, regrets and humour. A puppet can leave the village when its maker cannot.',
      zh: '携带制作者愿望、遗憾与幽默的布偶分身。当制作者暂时无法离开村庄，偶可以替她去外面看看世界。',
    },
    category: 'practice', date: '2024—NOW', count: 25, image: '/arena/angel-dolls.jpg', accent: 'blue',
  },
  {
    id: 'ethics-class',
    title: { en: 'Shanzhai Ethics Class', zh: '山寨思想品德课' },
    description: {
      en: 'A school without accreditation, where incomplete imitation becomes a way to ask who may author culture, organise others and name a tradition.',
      zh: '一所没有文凭的学校。在这里，“不完整的临摹”成为一种发问：谁可以创造文化、组织他人，并为传统命名？',
    },
    category: 'school', date: '2025—NOW', count: 23, image: '/arena/ritual-detail.jpg', accent: 'lime',
  },
  {
    id: 'dreams',
    title: { en: 'Dreams Written by Every Member', zh: '各个成员的梦编剧' },
    description: {
      en: '“Are you hiring?” “Can you use a sewing machine?” “Yes.” “Can you dream?” A collective script assembled from members’ nocturnal lives.',
      zh: '“请问这里招工吗？”“会用缝纫机吗？”“会。”“会做梦吗？”——一份由每个成员的夜间生活共同装订起来的剧本。',
    },
    category: 'practice', date: '2026', count: 8, accent: 'pink',
  },
  {
    id: 'beauty-detox',
    title: { en: 'Dongcun Beauty Detox Center', zh: '东村戒美所' },
    description: {
      en: 'Quit beauty. Love is the first productive force. Produce with the women of Dongcun. The sewing machine is always our fighter jet.',
      zh: '戒掉美丽。爱是第一生产力。和东村妇女一起生产。缝纫机始终是我们的战斗机。',
    },
    category: 'practice', date: '2021—NOW', count: 34, image: '/arena/beauty-detox.jpg', accent: 'red',
  },
  {
    id: 'experimental-theatre',
    title: { en: 'Dongcun Xinfu Experimental Theatre', zh: '东村新妇实验剧场' },
    description: {
      en: 'The open working archive: stage designs, scripts, rehearsal traces and the unstable definition of a theatre that travels.',
      zh: '持续开放的工作档案：舞台设计、剧本、排练痕迹，以及一个不断移动的剧团对“剧场”并不稳定的定义。',
    },
    category: 'practice', date: '2025—NOW', count: 30, image: '/arena/bed-stage.jpg', accent: 'pink',
  },
  {
    id: 'cheruby',
    title: { en: 'CHERUBY Recruitment Materials', zh: 'CHERUBY 招募资料' },
    description: {
      en: 'Open calls, handmade handbooks and provisional school notices: graphic matter that turns a gathering into an institution for a day.',
      zh: '公开招募、手工小册子和临时学校告示：这些平面物把一次聚集短暂地变成一所机构。',
    },
    category: 'school', date: '2026', count: 59, image: '/arena/cheruby.jpg', accent: 'blue',
  },
  {
    id: 'wenzhou',
    title: { en: 'Wenzhou Stop', zh: '温州站' },
    description: {
      en: 'A moving station in the troupe’s route: recruit locally, build a temporary stage, learn in public, perform, pack, continue.',
      zh: '剧团漂流路线中的一个站点：当地招募、搭临时舞台、公开学习、演出、收拾，再继续上路。',
    },
    category: 'journey', date: '2024', count: 11, image: '/arena/opening.jpg', accent: 'red',
  },
  {
    id: 'shenzhen',
    title: { en: 'Shenzhen Stop', zh: '深圳站' },
    description: {
      en: 'A brief urban landing for a village-born, open-source troupe. Each station rewrites the cast and the meaning of “local.”',
      zh: '一个从村庄出发的开源剧团短暂降落城市。每一个站点都重新改写演员表，也重新改写“本地”的意思。',
    },
    category: 'journey', date: '2026', count: 2, image: '/arena/gate.jpg', accent: 'lime',
  },
  {
    id: 'shanghai',
    title: { en: 'Shanghai Stop — Rockbund Art Museum', zh: '上海站—外滩美术馆' },
    description: {
      en: 'A stop that sharpened questions of access, discipline and institutional hospitality. Who sets the rules, and whose behaviour receives cultural backing?',
      zh: '一个让进入、规训与机构待客之道变得尖锐的站点：谁制定规则？谁的行为能够得到“文化背书”？',
    },
    category: 'journey', date: '2026', count: 8, image: '/arena/bed-stage.jpg', accent: 'blue',
  },
  {
    id: 'drifting-diary',
    title: { en: 'Drifting Diary', zh: '漂流日记' },
    description: {
      en: 'Notes made between villages, trains, museums, hotel rooms and stages: the troupe seen from inside the act of moving.',
      zh: '写在村庄、列车、美术馆、酒店房间与戏台之间的笔记：从移动这件事的内部看剧团。',
    },
    category: 'journey', date: 'ONGOING', count: 5, image: '/arena/arrival.jpg', accent: 'pink',
  },
  {
    id: 'philharmonic',
    title: { en: 'Dongcun International Philharmonic', zh: '东村国际爱乐乐团' },
    description: {
      en: 'DIY instruments, borrowed rhythms and the sounds around a performance: welding, cooking, coughing, chatter and babies crying.',
      zh: 'DIY 乐器、借来的节奏，以及演出周围的声音：电焊、做饭、咳痰、交谈与婴儿的哭声。',
    },
    category: 'practice', date: '2025—NOW', count: 3, image: '/arena/rehearsal.jpg', accent: 'lime',
  },
];

const articles: Article[] = [
  {
    number: '01',
    title: { en: 'Shanzhai Is a Method, Not a Style', zh: '山寨是一种方法，不是一种风格' },
    dek: {
      en: 'Incomplete imitation, creative misreading and the survival intelligence of a travelling folk troupe.',
      zh: '不完整的临摹、创造性的误读，以及一个民间流动剧团的生存智慧。',
    },
    body: {
      en: [
        'Dongcun Xinfu is an open-source, itinerant theatre. We travel, recruit publicly and build temporary stages as a way to enter into dialogue with each place. Sewing, music, puppet training, rehearsals and conversations happen in public, allowing every stop to gather multiple dimensions like a temple fair.',
        'Our primary shanzhai subject is the Xin Zheng Shun puppet troupe, an active folk troupe performing for deities and festivals throughout Chaoshan. Historically, iron-rod puppetry was itself a reduced copy of live Teochew opera. Through continuous imitation it became real grassroots culture—and a real shanzhai spirit.',
        'We are interested not only in recording technique. Behind the stage are emotional ties: people locating themselves in life through time spent together, and finding ways to survive. To follow the troupe is to study principles and improvisations at once.',
        'For us, shanzhai means turning the practice into an open tool kit: a low-tech stage, shared roles, local recruitment and the permission to copy imperfectly. The method stays alive only when someone else can take it, alter it and set off again.',
      ],
      zh: [
        '东村新妇是一个开源、漂流的剧团。我们通过不断行走、公开招募、搭建临时舞台的方式与每一个地方发生对话。缝纫、音乐、操偶训练、排练和分享常常在公共场域进行，让每一站像庙会一样同时展开许多维度。',
        '我们现在的主要山寨对象是新正顺木偶剧团——一个活跃于潮汕、为大小节日演酬神戏的民俗剧团。历史上，潮州铁枝木偶戏原本就是真人潮剧的精简翻版；通过不断模仿技艺，它成为真正的草根文化，也体现了真正的山寨精神。',
        '我们不只记录技艺。舞台演绎的背后，是剧团中每个人的情感连接，是在共同度过的时光中找到自己在生活里的位置和生存方式。跟随剧团，就是同时学习他们坚持的原则与现实中的变通。',
        '对我们而言，山寨意味着把实践整理成一种开放工具：低技术的舞台、多重身份、沿途招募，以及不完整临摹的许可。只有当别人也能拿走、改写并再次上路，这个方法才真正活着。',
      ],
    },
  },
  {
    number: '02',
    title: { en: 'Shanghai Diary: We Keep Apologising and Giving Thanks', zh: '上海日记：我们一直在道歉和道谢' },
    dek: {
      en: 'A collective reflection on rules, cultural legitimacy and the labour of making people meet.',
      zh: '关于规则、文化合法性，以及“让人相遇”这种劳动的一次集体反思。',
    },
    body: {
      en: [
        'We did not hear a single “thank you for your performance.” Instead we were told that we did not follow rules, that our clothes and behaviour were strange. We were asked to fit a framework and learn from those already considered excellent and traditional.',
        'But our actions did not come from nowhere. They each have a history. With courage and imagination, we simply carried what we understand and believe a little further outward. When someone said, “At first you did not listen; later you were so well behaved,” our judgement, labour and creativity seemed to be reduced to obedience.',
        'Dongcun Xinfu is often examined by inherited hierarchies and standards. Yet our work also participates in society: it lets people meet, lets relationships happen and makes habitual rules visible again. Why is that labour so easily dismissed?',
        'I no longer want to apologise and give thanks by habit. We did not ruin things. We made clothes, props and performances with courage and imagination. This time, I want to return the thanks to ourselves: thank you for our performance.',
      ],
      zh: [
        '我们没有听到一句“谢谢你们的表演”，收到的是：不守规矩，服装奇怪，行为奇怪。我们被要求符合框架，学习那些已经被认为优秀、符合传统的人是怎么做事的。',
        '但我们的行为不是凭空发生的，都有各自的来处。我们只是带着勇气和想象力，把自己理解、相信的东西继续往外拓展。当有人说“开始你们都不听，后来你们都好乖啊”，我们的付出、判断和创造，好像最后都被归结成了服从。',
        '东村新妇一直承受着太多来自固有阶层和标准的审视。但我们做的事也在参与这个社会：让人相遇，让关系发生，让习以为常的规则有机会被重新看见。为什么这些劳动总是被轻视？',
        '我不想再习惯性地道歉和道谢。我们没有把事情搞砸，我们做出了衣服、道具和表演，也付出了勇气与想象力。这一次，我想把感谢还给我们自己：谢谢我们的表演。',
      ],
    },
  },
  {
    number: '03',
    title: { en: 'Recess: How to Become a Troupe Leader', zh: '大课间：如何成为团长' },
    dek: {
      en: 'Folk organisation, handmade shoes, a seven-year-old leader and the interval where another story can begin.',
      zh: '民间组织、手工鞋、七岁的团长，以及一个可以重新开始故事的间歇。',
    },
    body: {
      en: [
        'Xin Zheng Shun has operated for more than thirty years. Its leader, Li Jiena, taught herself Teochew opera when she was young, then brought her family and neighbours together to run four troupes active at temple rituals and funerals throughout Chaoshan.',
        'Asked whether she made a troupe because she loved art, she answered: “No. In other work people often withheld our pay, but nobody dares owe money to an opera troupe.” The troupe is an artistic form and an economic shelter at the same time.',
        'Because the current leader of our shanzhai troupe is only seven years old, we decided—carefully—to establish a council of troupe leaders. Recess is where this can happen: an open interval for games, rituals, conversations and performance impulses not yet digested by rehearsal.',
        'A longer break allows the stage to be rebuilt, the actors to change roles and the story to be told again. We can also sit down and reread the script. Recess is not outside the work. It is where the work learns to change shape.',
      ],
      zh: [
        '新正顺潮剧团已经运营三十多年。团长李洁娜自幼自学潮剧，后来带动全家和村里其他人一起经营四个剧团，常年活跃于潮汕寺庙祭神、丧葬等民俗活动。',
        '问她做剧团是不是因为喜欢艺术，她回答：“不，因为做别的工作经常被欠钱，但谁都不敢欠潮剧团的钱。”剧团同时是一种艺术形式，也是一种经济庇护。',
        '因为山寨剧团现任团长只有七岁，我们谨慎地决定成立一个团长智囊团。大课间就是这件事可以发生的地方：向外开放的游戏、仪式、对话，以及尚未被排练消化的表演欲望。',
        '比普通课间更长的调整时间里，舞台可以重新制景、演员可以转换角色、故事也可以重新讲一遍。我们也可以坐下来，再读一次剧本。大课间并不在创作之外；它是创作学习改变形状的地方。',
      ],
    },
  },
];

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [filter, setFilter] = useState<Filter>('all');
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [openArticle, setOpenArticle] = useState<Article | null>(null);
  const overlayOpen = Boolean(openProject || openArticle);

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenProject(null);
        setOpenArticle(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [overlayOpen]);

  const t = <T extends { en: string; zh: string }>(copy: T) => copy[language];
  const visibleProjects = filter === 'all' ? projects : projects.filter((project) => project.category === filter);

  return (
    <main>
      <nav className="topbar">
        <a className="wordmark" href="#top">DONGCUN XINFU</a>
        <div className="nav-links" aria-label="Primary navigation">
          <a href="#archive">{language === 'en' ? 'Archive' : '档案'}</a>
          <a href="#notes">{language === 'en' ? 'Notes' : '文章'}</a>
          <a href="#about">{language === 'en' ? 'About' : '关于'}</a>
        </div>
        <button
          className="language-switch"
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          aria-label={language === 'en' ? '切换到中文' : 'Switch to English'}
        >
          <span className={language === 'en' ? 'active' : ''}>EN</span>
          <span>/</span>
          <span className={language === 'zh' ? 'active' : ''}>中</span>
        </button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">OPEN-SOURCE · NOMADIC · CHAOSHAN</p>
          <h1 aria-label="New East Village New Brides">
            <span>NEW EAST</span>
            <span>VILLAGE</span>
            <span>NEW BRIDES</span>
          </h1>
          <p className="intro" lang={language === 'en' ? 'en' : 'zh-CN'}>
            {language === 'en'
              ? 'A travelling theatre born from sewing rooms, village rituals and an empty bed transformed into a tiny stage.'
              : '一个从缝纫房、村庄仪式和一张变成小戏台的空床中诞生的漂流剧团。'}
          </p>
          <a className="enter-link" href="#archive">
            {language === 'en' ? 'ENTER THE ARCHIVE ↓' : '进入档案 ↓'}
          </a>
        </div>

        <figure className="hero-image-wrap">
          <img className="hero-image" src="/arena/arrival.jpg" alt="Members of Dongcun Xinfu walking through a village" />
          <figcaption>
            <span>FIELD NOTE 001</span>
            <span>{language === 'en' ? 'THE TROUPE KEEPS MOVING' : '剧团继续漂流'}</span>
          </figcaption>
        </figure>
        <p className="vertical-label">SHANZHAI IS A METHOD, NOT A STYLE.</p>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>
          <span>SEWING IS A WEAPON</span><i>✦</i><span>LOVE IS THE FIRST PRODUCTIVE FORCE</span><i>✦</i><span>缝纫机是我们的战斗机</span><i>✦</i>
          <span>SEWING IS A WEAPON</span><i>✦</i><span>LOVE IS THE FIRST PRODUCTIVE FORCE</span><i>✦</i><span>缝纫机是我们的战斗机</span><i>✦</i>
        </div>
      </div>

      <section className="archive section-pad" id="archive">
        <header className="section-header">
          <div>
            <p className="section-kicker">001 / ARE.NA RECONSTRUCTED</p>
            <h2>{language === 'en' ? 'The living archive' : '活的档案'}</h2>
          </div>
          <p className="section-intro">
            {language === 'en'
              ? 'Seventeen Are.na channels become seventeen doors into performances, schools, journeys and unfinished methods.'
              : '把 Are.na 里的十七个频道变成十七扇门，通往演出、学校、旅程和仍在生成的方法。'}
          </p>
        </header>

        <div className="filter-row" aria-label="Archive filters">
          {filters.map((item) => (
            <button
              type="button"
              key={item.id}
              className={filter === item.id ? 'selected' : ''}
              onClick={() => setFilter(item.id)}
            >
              {item[language]} <span>{item.id === 'all' ? projects.length : projects.filter((p) => p.category === item.id).length}</span>
            </button>
          ))}
        </div>

        <div className="project-grid">
          {visibleProjects.map((project, index) => (
            <button
              className={`project-card ${project.accent} ${project.image ? '' : 'text-card'}`}
              type="button"
              key={project.id}
              onClick={() => setOpenProject(project)}
              aria-label={`${language === 'en' ? 'Open' : '打开'} ${t(project.title)}`}
            >
              <div className="project-media">
                {project.image ? (
                  <img src={project.image} alt="" />
                ) : (
                  <span className="text-card-title">{t(project.title)}</span>
                )}
                <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="project-meta">
                <h3>{t(project.title)}</h3>
                <div>
                  <span>{project.date}</span>
                  <span>{project.count} {language === 'en' ? 'BLOCKS' : '块'}</span>
                  <span>↗</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-stamp">SHANZHAI<br />山寨<br />METHOD</div>
        <blockquote>
          {language === 'en'
            ? '“Not because I love art. In other jobs people withheld our pay, but nobody dares owe money to an opera troupe.”'
            : '“不是因为喜欢艺术，是因为做别的工作经常被欠钱，但谁都不敢欠潮剧团的钱。”'}
        </blockquote>
        <p>— LI JIENA / 李洁娜 · XIN ZHENG SHUN TROUPE LEADER</p>
      </section>

      <section className="notes section-pad" id="notes">
        <header className="section-header light">
          <div>
            <p className="section-kicker">002 / WRITING & FIELD NOTES</p>
            <h2>{language === 'en' ? 'Read between stages' : '在戏台之间阅读'}</h2>
          </div>
          <p className="section-intro">
            {language === 'en'
              ? 'The language switch translates the full reading experience—not only the navigation.'
              : '语言开关切换的是完整阅读体验，而不只是菜单。'}
          </p>
        </header>

        <div className="article-list">
          {articles.map((article) => (
            <button className="article-row" type="button" key={article.number} onClick={() => setOpenArticle(article)}>
              <span className="article-number">{article.number}</span>
              <span className="article-title">{t(article.title)}</span>
              <span className="article-dek">{t(article.dek)}</span>
              <span className="round-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="about-image">
          <img src="/arena/bed-stage.jpg" alt="A bed transformed into a miniature puppet stage" />
          <span>{language === 'en' ? 'THE BED BECOMES A STAGE' : '床变成戏台'}</span>
        </div>
        <div className="about-copy">
          <p className="section-kicker">003 / ABOUT THE TROUPE</p>
          <h2>{language === 'en' ? 'A small stage, built to drift.' : '一个为漂流而造的小戏台。'}</h2>
          <p>
            {language === 'en'
              ? 'After a ninety-year-old grandmother died, her room was emptied. A child asked where she had gone. Artist Si Miao Xiuqin turned the remaining bed into a puppet stage and invited women from Dongcun to gather, sew human-shaped puppets and rehearse their stories in a space parallel to reality.'
              : '一位生活了九十年的阿嬷离世后，房间被清空了。一个孩子问：“老嬷去哪里了？”寺苗秀琴把留下的床变成小小的偶戏台，邀请东村妇女定期相聚、缝纫、共同制作人形偶，并把她们的故事排练在一个与现实平行的空间里。'}
          </p>
          <p>
            {language === 'en'
              ? 'The collective works with Teochew opera, iron-rod puppetry, women’s labour and mobile public space. Every stop is an invitation to join.'
              : '剧团以潮剧、铁枝木偶、女性劳动与流动公共空间为材料。每一个站点，都是一次加入的邀请。'}
          </p>
          <div className="about-links">
            <a href="https://www.are.na/m4a6blpm_hc" target="_blank" rel="noreferrer">ARE.NA ↗</a>
            <a href="https://www.instagram.com/dongcunxinfu" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-name">DONGCUN<br />XINFU</div>
        <p>{language === 'en' ? 'EVERY VILLAGE CAN BE DONGCUN.' : '每一个普通村子，都可以是东村。'}</p>
        <a href="#top">↑ {language === 'en' ? 'BACK TO TOP' : '回到顶部'}</a>
      </footer>

      {openProject && (
        <div className="overlay" role="presentation" onMouseDown={() => setOpenProject(null)}>
          <section className="drawer" role="dialog" aria-modal="true" aria-labelledby="project-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="close-button" type="button" onClick={() => setOpenProject(null)} aria-label="Close">CLOSE ×</button>
            {openProject.image && <img className="drawer-image" src={openProject.image} alt="" />}
            <p className="drawer-meta">{openProject.date} · {openProject.count} {language === 'en' ? 'ARE.NA BLOCKS' : '个 ARE.NA 块'}</p>
            <h2 id="project-title">{t(openProject.title)}</h2>
            <p className="drawer-description">{t(openProject.description)}</p>
            <a className="source-link" href="https://www.are.na/m4a6blpm_hc" target="_blank" rel="noreferrer">
              {language === 'en' ? 'VIEW SOURCE ARCHIVE ↗' : '查看原始档案 ↗'}
            </a>
          </section>
        </div>
      )}

      {openArticle && (
        <div className="overlay article-overlay" role="presentation" onMouseDown={() => setOpenArticle(null)}>
          <article className="reader" role="dialog" aria-modal="true" aria-labelledby="article-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="reader-top">
              <span>FIELD NOTE {openArticle.number}</span>
              <button className="reader-language" type="button" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>
                {language === 'en' ? '阅读中文' : 'READ ENGLISH'}
              </button>
              <button className="close-button" type="button" onClick={() => setOpenArticle(null)} aria-label="Close">CLOSE ×</button>
            </div>
            <div className="reader-body">
              <h2 id="article-title">{t(openArticle.title)}</h2>
              <p className="reader-dek">{t(openArticle.dek)}</p>
              <div className="reader-text">
                {openArticle.body[language].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <p className="reader-source">SOURCE: DONGCUN XINFU ARE.NA ARCHIVE · EDITED BILINGUAL VERSION</p>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
