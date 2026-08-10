import Parser from "rss-parser";

const parser = new Parser({ timeout: 10_000 });

export interface ParsedFeedItem {
  title: string | null;
  link: string | null;
  guid: string | null;
  isoDate: string | null;
  pubDate: string | null;
  contentSnippet: string | null;
  content: string | null;
  categories: string[];
  creator: string | null;
  imageUrl: string | null;
}

export interface ParsedFeed {
  title: string | null;
  items: ParsedFeedItem[];
}

/** Parses RSS 2.0 or Atom XML (rss-parser supports both) into a normalized shape. Throws on malformed XML — callers must catch. */
export async function parseFeedXml(xml: string): Promise<ParsedFeed> {
  const feed = await parser.parseString(xml);

  return {
    title: feed.title ?? null,
    items: (feed.items ?? []).map((item) => ({
      title: item.title ?? null,
      link: item.link ?? null,
      guid: item.guid ?? null,
      isoDate: item.isoDate ?? null,
      pubDate: item.pubDate ?? null,
      contentSnippet: item.contentSnippet ?? null,
      content: item.content ?? item.summary ?? null,
      categories: item.categories ?? [],
      creator: item.creator ?? null,
      // Do not extract or hotlink publisher images without recorded permission.
      imageUrl: null,
    })),
  };
}
