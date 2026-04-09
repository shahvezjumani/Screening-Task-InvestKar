import * as cheerio from "cheerio";

export interface Quote {
  id: number;
  text: string;
  author: string;
  tags: string[];
  scrapedAt: string;
}

const TARGET_URL = "https://quotes.toscrape.com/";

export async function scrapeQuotes(): Promise<Quote[]> {
  const response = await fetch(TARGET_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const quotes: Quote[] = [];

  $(".quote").each((index, element) => {
    const text = $(element)
      .find(".text")
      .text()
      .replace(/\u201c|\u201d/g, "");
    const author = $(element).find(".author").text();
    const tags: string[] = [];
    $(element)
      .find(".tag")
      .each((_, tag) => {
        tags.push($(tag).text());
      });

    quotes.push({
      id: index + 1,
      text,
      author,
      tags,
      scrapedAt: new Date().toISOString(),
    });
  });

  return quotes;
}
