import type { CollectionEntry } from "astro:content";

export type NoteEntry = CollectionEntry<"notes">;

type LatestNotesOptions = {
  excludeIds?: string[];
};

const zhCollator = new Intl.Collator("zh-CN");

function compareNotesByDateDesc(a: NoteEntry, b: NoteEntry) {
  return b.data.date.getTime() - a.data.date.getTime();
}

function dedupeNotes(notes: NoteEntry[]) {
  const seen = new Set<string>();
  return notes.filter((note) => {
    if (seen.has(note.id)) {
      return false;
    }

    seen.add(note.id);
    return true;
  });
}

function getSharedTagCount(current: NoteEntry, candidate: NoteEntry) {
  const currentTags = new Set(current.data.tags);
  return candidate.data.tags.reduce((count, tag) => count + (currentTags.has(tag) ? 1 : 0), 0);
}

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
    "C++": "cpp",
    "关于": "about",
    "站点": "site"
  };

  return map[label] || label.toLowerCase().replace(/\s+/g, "-");
}

export function getPublishedNotes(notes: NoteEntry[]) {
  return [...notes].filter((note) => !note.data.draft).sort(compareNotesByDateDesc);
}

export function getFeaturedNotes(notes: NoteEntry[], limit = 3) {
  return getPublishedNotes(notes)
    .filter((note) => note.data.featured)
    .slice(0, limit);
}

export function getLatestNotes(notes: NoteEntry[], limit = 3, options: LatestNotesOptions = {}) {
  const excluded = new Set(options.excludeIds ?? []);
  return getPublishedNotes(notes)
    .filter((note) => !excluded.has(note.id))
    .slice(0, limit);
}

export function getPrevNextNotes(notes: NoteEntry[], currentId: string) {
  const publishedNotes = getPublishedNotes(notes);
  const currentIndex = publishedNotes.findIndex((note) => note.id === currentId);

  if (currentIndex === -1) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: currentIndex > 0 ? publishedNotes[currentIndex - 1] : undefined,
    next: currentIndex < publishedNotes.length - 1 ? publishedNotes[currentIndex + 1] : undefined
  };
}

export function getRelatedNotes(notes: NoteEntry[], current: NoteEntry, limit = 3) {
  const publishedNotes = getPublishedNotes(notes);
  const relatedMap = new Map(publishedNotes.map((note) => [note.id, note]));
  const manualRelated = current.data.related
    .map((slug) => relatedMap.get(slug))
    .filter((note): note is NoteEntry => Boolean(note) && note.id !== current.id);

  const excluded = new Set([current.id, ...manualRelated.map((note) => note.id)]);
  const candidates = publishedNotes.filter((note) => !excluded.has(note.id));

  const sameTagNotes = candidates
    .filter((note) => getSharedTagCount(current, note) > 0)
    .sort((a, b) => {
      const diff = getSharedTagCount(current, b) - getSharedTagCount(current, a);
      return diff !== 0 ? diff : compareNotesByDateDesc(a, b);
    });

  const sameCategoryNotes = candidates
    .filter((note) => note.data.category === current.data.category)
    .sort(compareNotesByDateDesc);

  return dedupeNotes([...manualRelated, ...sameTagNotes, ...sameCategoryNotes]).slice(0, limit);
}

export function getNoteSummary(note: NoteEntry) {
  return note.data.excerpt || note.data.description;
}

export function tagLabelFromSlug(slug: string, notes: NoteEntry[]) {
  const found = getPublishedNotes(notes)
    .flatMap((note) => note.data.tags)
    .find((tag) => slugifyTag(tag) === slug);

  return found || slug;
}

export function getTagStats(notes: NoteEntry[]) {
  const counts = new Map<string, number>();

  getPublishedNotes(notes).forEach((note) => {
    new Set(note.data.tags).forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count, slug: slugifyTag(label) }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : zhCollator.compare(a.label, b.label)));
}

export function getResearchTracks(notes: NoteEntry[]) {
  const publishedNotes = getPublishedNotes(notes);
  const withTag = (targets: string[]) =>
    publishedNotes.filter((note) => note.data.tags.some((tag) => targets.includes(tag)) || targets.includes(note.data.category));

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
  return getTagStats(notes).map((item) => ({
    title: `${item.label} (${item.count})`,
    meta: "标签 / 主题检索",
    url: `/tags/${item.slug}`,
    keywords: [item.label, "标签", "主题"]
  }));
}
