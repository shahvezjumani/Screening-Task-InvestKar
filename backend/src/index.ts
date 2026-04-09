import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { scrapeQuotes } from "./scraper";
import { saveQuotes, loadQuotes } from "./store";
import { startCronJob } from "./cron";

const app = new Elysia()
  .use(cors())
  .get("/", () => ({ status: "ok", message: "InvestKar Scraper API" }))
  .get("/api/quotes", () => {
    const data = loadQuotes();
    return data;
  })
  .get("/api/quotes/:id", ({ params: { id } }) => {
    const data = loadQuotes();
    const quote = data.quotes.find((q) => q.id === Number(id));
    if (!quote) {
      return { error: "Quote not found" };
    }
    return quote;
  })
  .get("/api/quotes/author/:author", ({ params: { author } }) => {
    const data = loadQuotes();
    const filtered = data.quotes.filter((q) =>
      q.author.toLowerCase().includes(author.toLowerCase()),
    );
    return { quotes: filtered, count: filtered.length };
  })
  .post("/api/scrape", async () => {
    const quotes = await scrapeQuotes();
    saveQuotes(quotes);
    return { message: "Scrape complete", count: quotes.length };
  })
  .listen(3001);

// Run initial scrape on startup
(async () => {
  console.log("Running initial scrape...");
  try {
    const quotes = await scrapeQuotes();
    saveQuotes(quotes);
    console.log(`Initial scrape: ${quotes.length} quotes saved`);
  } catch (err) {
    console.error("Initial scrape failed:", err);
  }

  // Start CRON job
  startCronJob();
})();

console.log(`Server running at http://localhost:${app.server?.port}`);
