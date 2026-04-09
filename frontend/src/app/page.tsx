"use client";

import { useEffect, useState } from "react";

interface Quote {
  id: number;
  text: string;
  author: string;
  tags: string[];
  scrapedAt: string;
}

interface ApiData {
  lastUpdated: string;
  quotes: Quote[];
}

const API_URL = "http://localhost:3001";

export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [scraping, setScraping] = useState(false);

  async function fetchQuotes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/quotes`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiData = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  async function triggerScrape() {
    setScraping(true);
    try {
      await fetch(`${API_URL}/api/scrape`, { method: "POST" });
      await fetchQuotes();
    } catch {
      setError("Scrape failed");
    } finally {
      setScraping(false);
    }
  }

  useEffect(() => {
    fetchQuotes();
  }, []);

  const allTags = Array.from(
    new Set(data?.quotes.flatMap((q) => q.tags) ?? []),
  );

  const filtered =
    data?.quotes.filter((q) => {
      const matchesSearch =
        !search ||
        q.text.toLowerCase().includes(search.toLowerCase()) ||
        q.author.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || q.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    }) ?? [];

  const uniqueAuthors = new Set(data?.quotes.map((q) => q.author) ?? []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              InvestKar
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Quote Scraper Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchQuotes}
              className="px-4 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={triggerScrape}
              disabled={scraping}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {scraping ? "Scraping..." : "Scrape Now"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Total Quotes
              </p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {data.quotes.length}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Unique Authors
              </p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {uniqueAuthors.size}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Last Updated
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {data.lastUpdated
                  ? new Date(data.lastUpdated).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search quotes or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedTag ?? ""}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-20 text-zinc-500">Loading...</div>
        )}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button
              onClick={fetchQuotes}
              className="px-4 py-2 text-sm rounded-lg border border-zinc-300 hover:bg-zinc-100 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-sm text-zinc-500 mb-4">
              Showing {filtered.length} of {data?.quotes.length ?? 0} quotes
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <blockquote className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 italic">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      &mdash; {quote.author}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {quote.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="px-2.5 py-0.5 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
