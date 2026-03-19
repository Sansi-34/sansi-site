export const siteMeta = {
  name: "Sansi",
  titleSuffix: "Sansi · blog",
  description: "记录 C++、嵌入式、PCB 打板与 AR 图形实践，持续整理确定性、验证链路与性能预算。",
  siteUrl: "https://sansi34.xyz",
  themeColor: "#fafafa",
  faviconPath: "/favicon.svg",
  ogImagePath: "/og-cover.svg"
};

export const navItems = [
  { label: "首页", href: "/" },
  { label: "专题", href: "/archive" },
  { label: "笔记", href: "/notes" },
  { label: "关于", href: "/about" }
] as const;

export const homeHero = {
  eyebrow: "旧文拾回",
  titleLines: ["低頭趕路，", "敬事如儀。"],
  noteLines: ["叁肆。", "水深流缓，三思而后定。"],
  primaryCta: { label: "先看以前写过的", href: "/archive" },
  secondaryCta: { label: "再看看我现在在研究什么", href: "/about" }
};

export const oldPosts = [
  {
    title: "家里有成砖的米环7先别扔，先看看我这再决定",
    summary: "一篇早期的救砖记录，写的是把已经半死不活的设备一点点拉回来的过程。",
    href: "https://www.coolapk.com/feed/48604151?s=MGRlZmZjZGIxNTg5NzI3ZzY5YjU2MmFmega1580",
    label: "以前写过",
    meta: ["酷安旧文", "高中时期"],
    keywords: ["米环7", "救砖", "酷安", "手环", "恢复"]
  },
  {
    title: "努比亚z17mini！！！小牛",
    summary: "当时写手机体验，语气很冲，但喜欢什么、不满意什么，基本都写在明面上了。",
    href: "https://www.coolapk.com/feed/49350212?s=ZDZmZjcwNmQxNTg5NzI3ZzY5YjU2MmM3ega1580",
    label: "以前写过",
    meta: ["酷安旧文", "高中时期"],
    keywords: ["努比亚", "z17mini", "小牛", "手机", "酷安"]
  },
  {
    title: "什么？三星平板能“死而复生”！！！",
    summary: "也是一篇偏折腾向的排障记录，带点兴奋，也带点不服输。",
    href: "https://www.coolapk.com/feed/48018008?s=NjRiODU1YmIxNTg5NzI3ZzY5YjU2NGJmega1580",
    label: "以前写过",
    meta: ["酷安旧文", "高中时期"],
    keywords: ["三星平板", "死而复生", "恢复", "酷安", "平板"]
  }
] as const;

export const upcomingTracks = [
  {
    kicker: "在研究",
    title: "确定性内存池、启动链路和那些最难复现的运行时问题",
    status: "会补"
  },
  {
    kicker: "在研究",
    title: "PCB 打板、AR 图形，还有怎么把过程写成真能复用的记录",
    status: "会补"
  }
] as const;

export const aboutHero = {
  title: "有些硬问题，躲不过去，只能一件件做实。",
  description:
    "我主要做 C++、嵌入式、PCB 打板和 AR 图形相关的工程实践。这个博客不拿来摆热闹，只记那些真碰过、真摔过、最后还能站住的东西。能留下来的，不只是结果，还有判断、代价和路数。"
};

export const aboutMetrics = [
  {
    label: "长期方向",
    title: "底层系统与交互图形",
    body: "长期盯住 allocator、启动链路、追踪与渲染这些高复杂度问题，把它们整理成更稳定的处理方法。"
  },
  {
    label: "工作方式",
    title: "先观测，再优化",
    body: "我更相信日志、指标、边界条件和可重复验证，而不是靠经验拍脑袋修问题。"
  },
  {
    label: "擅长领域",
    title: "C++ / 嵌入式 / PCB / AR",
    body: "关注软硬件协同、板级验证、性能约束，以及工程表达本身是不是足够清楚。"
  },
  {
    label: "文档偏好",
    title: "安静、可检索、可复盘",
    body: "写下来的内容，半年后回来看仍然要能看懂、能追踪、能继续拿来用。"
  }
] as const;

export const aboutPrinciples = [
  {
    index: "01",
    title: "先把东西摆出来，再下判断",
    body: "日志、指标、现场条件、边界在哪，先摆出来。东西没摆明白，结论就先别急着下。"
  },
  {
    index: "02",
    title: "写下来，就得经得起回头看",
    body: "人会忘，现场会散，只有记录能不能站住。写下来的东西，过半年也得还能接着用。"
  },
  {
    index: "03",
    title: "名字、结构、文档，都不能糊弄",
    body: "命名糊了，结构乱了，文档没留住，后面的活就都得重新吃一遍苦头。"
  }
] as const;

export const contactInfo = {
  intro: "如果你也在啃这些问题，可以来聊。",
  body: "适合聊的，主要还是 C++、嵌入式系统、PCB 实践、AR 图形工程，还有怎么把一摊复杂东西整理成真能复用的记录。",
  tags: ["C++", "嵌入式", "PCB", "AR / 图形", "工程文档"],
  email: "san988232@gmail.com",
  xHandle: "@Sansi",
  xUrl: "https://x.com/Sansi"
};

export const footerText = "先把真的摆上来。";

