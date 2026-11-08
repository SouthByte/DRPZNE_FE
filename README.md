# DRPZNE

A bunch of cool shit. The public site, built with Astro 5 and Tailwind, rendered on Vercel.

Content comes from the Payload CMS (DRPZNE_CMS). Pages are rendered on the server, so new posts show
up without a rebuild. The browser never calls the CMS directly: search, "Load more" and the newsletter
go through this site's own routes (`/api/search.json`, `/partials/posts`, `/api/subscribe`).

## Environment

| Variable | Description |
|---|---|
| `CMS_URL` | Base URL of the CMS. Local: `http://localhost:3000`. Production: `https://admin.drpzne.com` |

Locally, put it in `.env` (git-ignored, see `.env.example`). On Vercel, set it under
Settings → Environment Variables: Production points at the production CMS, Preview at the dev CMS.

## Local development

```bash
npm install
cp .env.example .env
npm run dev   # http://localhost:4321
```

Run the CMS locally too (`pnpm dev` in DRPZNE_CMS). If the CMS isn't reachable in dev, posts fall
back to `src/data/postData.json`. In production there is no fallback.

## Routes

| Route | Page |
|---|---|
| `/` | Latest posts |
| `/category/<category>` and `/category/<category>/<sub>` | Category listings |
| `/<slug>` | Post |
| `/about`, `/contact`, `/submit`, `/advertise`, `/privacy`, `/terms` | Info pages |

Categories come from the CMS. `src/data/categories.ts` is the fallback and matches the CMS seed script.
