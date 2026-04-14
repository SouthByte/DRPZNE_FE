/**
 * DRPZNE API Service
 * 
 * Set PUBLIC_API_URL in .env to point to your backend.
 * Falls back to local JSON when API is unavailable.
 * Set PUBLIC_SANITY_PROJECT_ID to pull from Sanity CMS instead.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Post {
  id?: string | number;
  title: string;
  slug: string;
  publishedAt: string;
  description: string;
  image: string;
  images?: string[];
  productLink: string;
  price?: string;
  brand?: string;
  categories: string[];
  tags: string[];
  featured?: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = (import.meta.env.PUBLIC_API_URL || '').trim();
const SANITY_PROJECT_ID = (import.meta.env.PUBLIC_SANITY_PROJECT_ID || '').trim();

// ─── REST API helpers ─────────────────────────────────────────────────────────

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ─── REST API functions ───────────────────────────────────────────────────────

export async function getPosts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}): Promise<Post[]> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.category) q.set('category', params.category);
  if (params?.tag) q.set('tag', params.tag);
  return fetchApi<Post[]>(`/posts${q.toString() ? '?' + q.toString() : ''}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return fetchApi<Post>(`/posts/${slug}`);
}

export async function getRelatedPosts(slug: string, limit = 4): Promise<Post[]> {
  return fetchApi<Post[]>(`/posts/${slug}/related?limit=${limit}`);
}

export async function searchPosts(query: string): Promise<Post[]> {
  return fetchApi<Post[]>(`/posts/search?q=${encodeURIComponent(query)}`);
}

// ─── Local JSON fallback ──────────────────────────────────────────────────────
 
async function getLocalPosts(): Promise<Post[]> {
  const mod = await import('../data/postData.json');
  return mod.default as Post[];
}

// ─── Sanity CMS functions ─────────────────────────────────────────────────────

async function getPostsFromSanity(params?: Parameters<typeof getPosts>[0]): Promise<Post[]> {
  const { sanityFetch, queries } = await import('./sanity');
  let posts = await sanityFetch<Post[]>(queries.allPosts);
  if (params?.category) {
    posts = posts.filter(p =>
      p.categories?.some(c => c.toLowerCase() === params.category!.toLowerCase())
    );
  }
  const page = params?.page || 1;
  const limit = params?.limit || 12;
  return posts.slice((page - 1) * limit, page * limit);
}

async function getPostBySlugFromSanity(slug: string): Promise<Post | null> {
  const { sanityFetch, queries } = await import('./sanity');
  return sanityFetch<Post | null>(queries.postBySlug, { slug });
}

async function getRelatedPostsFromSanity(slug: string, limit = 4): Promise<Post[]> {
  const { sanityFetch, queries } = await import('./sanity');
  const post = await sanityFetch<Post | null>(queries.postBySlug, { slug });
  const categories = post?.categories || [];
  return sanityFetch<Post[]>(queries.relatedPosts, { slug, categories, limit });
}

// ─── Safe public API (auto-selects source, falls back to local JSON) ──────────

export async function getPostsSafe(params?: Parameters<typeof getPosts>[0]): Promise<Post[]> {
  // 1. Try Sanity if configured
  if (SANITY_PROJECT_ID) {
    try { return await getPostsFromSanity(params); } catch {}
  }
  // 2. Try REST API if configured
  if (API_BASE) {
    try { return await getPosts(params); } catch {}
  }
  // 3. Fall back to local JSON
  const local = await getLocalPosts();
  const page = params?.page || 1;
  const limit = params?.limit || 12;
  return local.slice((page - 1) * limit, page * limit);
}

export async function getPostBySlugSafe(slug: string): Promise<Post | null> {
  if (SANITY_PROJECT_ID) {
    try { return await getPostBySlugFromSanity(slug); } catch {}
  }
  if (API_BASE) {
    try { return await getPostBySlug(slug); } catch {}
  }
  const local = await getLocalPosts();
  return local.find(p => p.slug === slug) ?? null;
}

export async function getRelatedPostsSafe(slug: string, limit = 4): Promise<Post[]> {
  if (SANITY_PROJECT_ID) {
    try { return await getRelatedPostsFromSanity(slug, limit); } catch {}
  }
  if (API_BASE) {
    try { return await getRelatedPosts(slug, limit); } catch {}
  }
  const local = await getLocalPosts();
  return local.filter(p => p.slug !== slug).slice(0, limit);
}

export async function searchPostsSafe(query: string): Promise<Post[]> {
  if (!query.trim()) return [];
  if (SANITY_PROJECT_ID) {
    try {
      const { sanityFetch, queries } = await import('./sanity');
      return sanityFetch<Post[]>(queries.searchPosts, { q: `${query}*` });
    } catch {}
  }
  if (API_BASE) {
    try { return await searchPosts(query); } catch {}
  }
  const local = await getLocalPosts();
  const q = query.toLowerCase();
  return local.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}
