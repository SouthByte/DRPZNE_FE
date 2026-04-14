# DRPZNE Frontend

Product catalog site built with Astro.js + Tailwind CSS.

## Stack
- **Framework**: Astro 5
- **Styling**: Tailwind CSS 4 + CSS Variables
- **Fonts**: Oxanium (display), IBM Plex Mono, Arimo
- **CMS**: Backend API (with local JSON fallback for dev)

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and set PUBLIC_API_URL to your backend
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_API_URL` | Backend API base URL (e.g. `https://api.drpzne.com`) |

## API Expected Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /posts` | List posts. Params: `page`, `limit`, `category`, `tag` |
| `GET /posts/:slug` | Single post by slug |
| `GET /posts/search?q=` | Search posts |
| `GET /posts/:slug/related` | Related posts |
| `POST /newsletter/subscribe` | Subscribe email |

## Deploy

### Vercel (recommended)
1. Push to GitHub
2. Import repo in Vercel
3. Set `PUBLIC_API_URL` in Vercel Environment Variables
4. Deploy

### Netlify
1. Push to GitHub
2. Import repo in Netlify
3. Set `PUBLIC_API_URL` in Site Settings > Environment
4. Build command: `npm run build`
5. Publish dir: `dist`
