# InvestKar — Quote Scraper Dashboard

A full-stack project that scrapes quotes from [quotes.toscrape.com](https://quotes.toscrape.com), serves them through a REST API, and displays them in a live dashboard.

## Project Structure

```
investKar/
├── backend/       # Bun + Elysia API server + scraper
└── frontend/      # Next.js dashboard
```

---

## Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Runtime   | [Bun](https://bun.sh)                           |
| API       | [Elysia](https://elysiajs.com)                  |
| Scraping  | [Cheerio](https://cheerio.js.org)               |
| Scheduler | [cron](https://www.npmjs.com/package/cron)      |
| Frontend  | [Next.js 16](https://nextjs.org) + Tailwind CSS |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) — install with `curl -fsSL https://bun.sh/install | bash` (or PowerShell equivalent)
- [Node.js](https://nodejs.org) v18+ (for the frontend)

### 1. Backend

```bash
cd backend
bun install
bun run dev
```

Server starts at **http://localhost:3001**.  
On startup it will immediately scrape quotes and schedule a re-scrape every 30 minutes.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard available at **http://localhost:3000**.

---

## API Reference

Base URL: `http://localhost:3001`

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| GET    | `/`                          | Health check                   |
| GET    | `/api/quotes`                | All quotes + last updated time |
| GET    | `/api/quotes/:id`            | Single quote by ID             |
| GET    | `/api/quotes/author/:author` | Filter quotes by author name   |
| POST   | `/api/scrape`                | Trigger a manual scrape        |

### Example response — `GET /api/quotes`

```json
{
  "lastUpdated": "2026-04-09T18:21:35.340Z",
  "quotes": [
    {
      "id": 1,
      "text": "The world as we have created it is a process of our thinking...",
      "author": "Albert Einstein",
      "tags": ["change", "deep-thoughts", "thinking", "world"],
      "scrapedAt": "2026-04-09T18:21:35.307Z"
    }
  ]
}
```

---

## Dashboard Features

- **Stats cards** — total quotes, unique authors, last updated timestamp
- **Search** — filter by quote text or author name
- **Tag filter** — dropdown to filter by tag
- **Clickable tags** — click any tag on a quote card to filter instantly
- **Scrape Now** button — triggers a fresh scrape without restarting the server
- **Refresh** button — re-fetches data from the API

---

## Data

Scraped data is stored locally at `backend/data/quotes.json` and is excluded from version control via `.gitignore`.

---

## CRON Schedule

The scraper runs automatically **every 30 minutes** while the backend server is running.
