import { getCollection } from "astro:content";
import { siteMeta } from "../data/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const notes = (await getCollection("notes"))
    .filter((note) => !note.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const items = notes
    .map((note) => {
      const url = `${siteMeta.siteUrl}/notes/${note.id}/`;
      const description = note.data.excerpt || note.data.description;

      return `
    <item>
      <title>${escapeXml(note.data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${note.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
      <category>${escapeXml(note.data.category)}</category>
    </item>`;
    })
    .join("");

  const latestDate = notes[0]?.data.date.toUTCString() ?? new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteMeta.name)}</title>
    <link>${siteMeta.siteUrl}/</link>
    <description>${escapeXml(siteMeta.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${latestDate}</lastBuildDate>${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
