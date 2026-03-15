import type { CollectionEntry } from "astro:content";
import { oldPosts } from "../data/site";
import { buildSearchIndex, getFeaturedNotes, getLatestNotes } from "./content";

export type SearchItem = {
  title: string;
  meta: string;
  url: string;
  keywords: string[];
};

export function getSearchIndex(notes: CollectionEntry<"notes">[]): SearchItem[] {
  const featuredIds = new Set(getFeaturedNotes(notes).map((note) => note.id));
  const latestIds = new Set(getLatestNotes(notes, 3).map((note) => note.id));

  const pages: SearchItem[] = [
    { title: "首页", meta: "页面 / 工程总览", url: "/", keywords: ["首页", "主页", "sansi", "工程笔记"] },
    { title: "专题", meta: "页面 / 旧文与站内笔记", url: "/archive", keywords: ["专题", "旧文", "归档"] },
    { title: "标签", meta: "标签 / 主题检索", url: "/tags", keywords: ["标签", "检索", "系统", "图形"] },
    { title: "图形与 AR", meta: "标签 / 图形 / 追踪 / 渲染", url: "/tags/graphics", keywords: ["AR", "图形", "渲染", "追踪"] },
    { title: "关于 Sansi", meta: "页面 / 简介与方法", url: "/about", keywords: ["about", "sansi", "关于"] }
  ];

  const oldPostEntries: SearchItem[] = oldPosts.map((item) => ({
    title: item.title,
    meta: "旧文 / 酷安",
    url: item.href,
    keywords: [...item.keywords, "旧文"]
  }));

  const noteEntries: SearchItem[] = notes.map((note) => {
    const stateLabel = featuredIds.has(note.id) ? "精选" : latestIds.has(note.id) ? "最新" : "笔记";

    return {
      title: note.data.title,
      meta: `${stateLabel} / ${note.data.category}`,
      url: `/notes/${note.id}`,
      keywords: [...note.data.keywords, ...note.data.tags, note.data.category, note.data.kicker, stateLabel]
    };
  });

  return [...pages, ...oldPostEntries, ...noteEntries, ...buildSearchIndex(notes)];
}
