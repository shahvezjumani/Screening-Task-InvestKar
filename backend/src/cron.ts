import { CronJob } from "cron";
import { scrapeQuotes } from "./scraper";
import { saveQuotes } from "./store";

export function startCronJob() {
  // Run every 30 minutes
  const job = new CronJob("*/30 * * * *", async () => {
    console.log(`[CRON] Scraping at ${new Date().toISOString()}`);
    try {
      const quotes = await scrapeQuotes();
      saveQuotes(quotes);
      console.log(`[CRON] Saved ${quotes.length} quotes`);
    } catch (err) {
      console.error("[CRON] Scrape failed:", err);
    }
  });

  job.start();
  console.log("[CRON] Scheduled: every 30 minutes");
  return job;
}
