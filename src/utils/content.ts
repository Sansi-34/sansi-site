import type { CollectionEntry } from "astro:content";

export type NoteEntry = CollectionEntry<"notes">;

export function slugifyTag(label: string) {
  const map: Record<string, string> = {
    "底层系统": "systems",
    "系统启动": "startup",
    "嵌入式": "embedded",
    "工具链": "toolchain",
    "调试": "debugging",
    "AR": "ar",
    "图形": "graphics",
    "渲染": "rendering",
    "C++": "cpp"
  };

  return map[label] || label.toLowerCase().replace(/\s+/g, "-");
}

export function getNoteSummary(note: NoteEntry) {
  return note.data.excerpt || note.data.description;
}

export function tagLabelFromSlug(slug: string, notes: NoteEntry[]) {
  const found = notes
    .flatMap((note) => note.data.tags)
    .find((tag) => slugifyTag(tag) === slug);

  return found || slug;
}

export function getTagStats(notes: NoteEntry[]) {
  const counts = new Map<string, number>();

  notes.forEach((note) => {
    new Set(note.data.tags).forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count, slug: slugifyTag(label) }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.label.localeCompare(b.label, "zh-CN")));
}

export function getResearchTracks(notes: NoteEntry[]) {
  const withTag = (targets: string[]) =>
    notes.filter((note) => note.data.tags.some((tag) => targets.includes(tag)) || targets.includes(note.data.category));

  const systemNotes = withTag(["底层系统", "C++", "嵌入式", "系统", "系统启动"]);
  const toolNotes = withTag(["工具链", "调试", "工具链"]);
  const graphicsNotes = withTag(["AR", "图形", "渲染", "图形"]);
  const hardwareNotes = withTag(["PCB", "硬件"]);

  return [
    {
      kicker: "系统",
      title: systemNotes[0]?.data.title ?? "确定性系统与运行时行为",
      summary: systemNotes[0] ? getNoteSummary(systemNotes[0]) : "先把分配路径、启动链路和运行时里的硬问题一件件钉住。",
      href: systemNotes[0] ? `/notes/${systemNotes[0].id}` : "/tags",
      meta: systemNotes.length > 0 ? `已写 ${systemNotes.length} 篇` : "还在起头"
    },
    {
      kicker: "工具链",
      title: toolNotes[0]?.data.title ?? "调试日志与问题复盘链路",
      summary: toolNotes[0] ? getNoteSummary(toolNotes[0]) : "日志、调试和复盘，后面会补成一条能回头看的链路。",
      href: toolNotes[0] ? `/notes/${toolNotes[0].id}` : "/tags",
      meta: toolNotes.length > 0 ? `已写 ${toolNotes.length} 篇` : "还在起头"
    },
    {
      kicker: "图形",
      title: graphicsNotes[0]?.data.title ?? "AR 与渲染链路",
      summary: graphicsNotes[0] ? getNoteSummary(graphicsNotes[0]) : "识别、追踪、渲染和交互，后面会按链路一段段拆开写。",
      href: graphicsNotes.length > 0 ? "/tags/graphics" : "/tags",
      meta: graphicsNotes.length > 0 ? `已写 ${graphicsNotes.length} 篇` : "还在起头"
    },
    {
      kicker: "硬件",
      title: hardwareNotes[0]?.data.title ?? "PCB 打板与返修判断",
      summary: hardwareNotes[0] ? getNoteSummary(hardwareNotes[0]) : "这一摊现在还没正式写进站里，但后面一定会补。",
      href: hardwareNotes[0] ? `/notes/${hardwareNotes[0].id}` : "/archive",
      meta: hardwareNotes.length > 0 ? `已写 ${hardwareNotes.length} 篇` : "后面会补"
    }
  ];
}

export function buildSearchIndex(notes: NoteEntry[]) {
  const tags = getTagStats(notes).map((item) => ({
    title: `${item.label} (${item.count})`,
    meta: "标签 / 主题检索",
    url: `/tags/${item.slug}`,
    keywords: [item.label, "标签", "主题"]
  }));

  return tags;
}
