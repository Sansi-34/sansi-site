import { getCollection } from "astro:content";
import { siteMeta } from "../data/site";
import { getTagStats } from "../utils/content";

function urlEntry(loc: string, lastmod?: Date) {
  const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : "";
  return `
  <url>
    <loc>${loc}</loc>${lastmodTag}
  </url>`;
}

export async function GET() {
  const notes = (await getCollection("notes"))
    .filter((note) => !note.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const staticEntries = [
    urlEntry(`${siteMeta.siteUrl}/`),
    urlEntry(`${siteMeta.siteUrl}/archive/`),
    urlEntry(`${siteMeta.siteUrl}/notes/`),
    urlEntry(`${siteMeta.siteUrl}/tags/`),
    urlEntry(`${siteMeta.siteUrl}/about/`),
    urlEntry(`${siteMeta.siteUrl}/rss.xml`)
  ];

  const noteEntries = notes.map((note) => urlEntry(`${siteMeta.siteUrl}/notes/${note.id}/`, note.data.date));
  const tagEntries = getTagStats(notes).map((tag) => urlEntry(`${siteMeta.siteUrl}/tags/${tag.slug}/`));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[
    ...staticEntries,
    ...noteEntries,
    ...tagEntries
  ].join("")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
