import { type Quote } from "./scraper";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(import.meta.dir, "..", "data");
const DATA_FILE = join(DATA_DIR, "quotes.json");

export interface StoreData {
  lastUpdated: string;
  quotes: Quote[];
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function saveQuotes(quotes: Quote[]): void {
  ensureDataDir();
  const data: StoreData = {
    lastUpdated: new Date().toISOString(),
    quotes,
  };
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function loadQuotes(): StoreData {
  ensureDataDir();
  if (!existsSync(DATA_FILE)) {
    return { lastUpdated: "", quotes: [] };
  }
  const raw = readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as StoreData;
}
