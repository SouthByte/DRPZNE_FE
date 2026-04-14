# DRPZNE — Full Setup Guide

## Project Structure
```
DRPZNE_FE/
├── src/              ← Astro frontend
│   ├── lib/api.ts    ← Backend API calls
│   ├── lib/sanity.ts ← Sanity CMS client
│   ├── pages/        ← Routes
│   └── components/   ← UI components
├── studio/           ← Sanity CMS admin
└── .env.example      ← Environment template
```

---

## Step 1 — Install & Run Locally

```bash
# Clone and install
git clone https://github.com/SouthByte/DRPZNE_FE.git
cd DRPZNE_FE
npm install

# Copy env
cp .env.example .env

# Run dev server
npm run dev
# → http://localhost:4321
```

---

## Step 2 — Set Up Sanity CMS (Admin Dashboard)

```bash
# Install Sanity CLI globally
npm install -g sanity

# Go into the studio folder
cd studio
npm install

# Initialize Sanity (creates project, gets project ID)
npx sanity init

# Copy the project ID into your .env:
# PUBLIC_SANITY_PROJECT_ID=abc123xyz
# PUBLIC_SANITY_DATASET=production

# Run the admin dashboard locally
npm run dev
# → http://localhost:3333
```

### Deploy the Admin Dashboard

```bash
cd studio
npx sanity deploy
# → https://drpzne.sanity.studio (or your custom studio name)
```

---

## Step 3 — Connect Your Backend API (Optional)

If you have a custom backend (Express, FastAPI, etc.):

```bash
# In your .env:
PUBLIC_API_URL=https://your-backend.com
```

Expected endpoints (see README.md for full list):
- `GET /posts` — list posts
- `GET /posts/:slug` — single post
- `GET /posts/search?q=` — search
- `GET /posts/:slug/related` — related posts

If `PUBLIC_API_URL` is not set or the API is down, the site automatically falls back to local JSON data.

---

## Step 4 — Deploy to Vercel

### Option A: GitHub Integration (recommended)
1. Push to GitHub: `git push origin main`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import `SouthByte/DRPZNE_FE`
4. Add Environment Variables:
   - `PUBLIC_SANITY_PROJECT_ID` = your Sanity project ID
   - `PUBLIC_SANITY_DATASET` = `production`
   - `PUBLIC_API_URL` = your backend URL (if applicable)
5. Click Deploy

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Step 5 — Add Content in Sanity

1. Open your studio: `https://drpzne.sanity.studio`
2. Go to **Posts / Drops** → **Create New**
3. Fill in: title, image, description, price, buy link, categories, tags
4. Click **Publish**
5. Your site rebuilds automatically via Vercel webhooks

---

## Data Flow

```
Sanity Studio (admin)
       ↓ publish
Sanity CDN (content API)
       ↓ GROQ query
src/lib/sanity.ts
       ↓
Astro pages (static build)
       ↓
Vercel CDN → Users
```

