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

const CMS_URL = (import.meta.env.PUBLIC_CMS_URL || 'http://localhost:3000').replace(/\/$/, '');

// Converts relative Payload media URLs to absolute URLs
function toAbsUrl(url?: string): string {
  if (!url) return '/placeholder.jpg'
  if (url.startsWith('http')) return url  // already absolute
  return `${CMS_URL}${url}`              // prepend CMS domain
}
// ─── REST API helpers ─────────────────────────────────────────────────────────

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${CMS_URL}${path}`, {
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

export async function getPostsSafe(params?: {
  page?: number; limit?: number; category?: string; tag?: string;
}): Promise<Post[]> {
  try {
    const q = new URLSearchParams();
    q.set('where[status][equals]', 'published');
    q.set('depth', '2');
    q.set('sort', '-publishedAt');
    q.set('limit', String(params?.limit ?? 12));
    if (params?.page) q.set('page', String(params.page));
    if (params?.category) {
      q.set('where[or][0][category.slug][equals]', params.category);
      q.set('where[or][1][subCategory.slug][equals]', params.category);
    }
    const res = await fetch(`${CMS_URL}/api/posts?${q}`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`CMS ${res.status}`);
    const data = await res.json();
    return data.docs.map((p: any) => ({
      ...p,
      image: toAbsUrl(p.heroImage?.sizes?.card?.url ?? p.heroImage?.url),
      categories: [p.category?.name, p.subCategory?.name].filter(Boolean),
      tags: (p.tags || []).map((t: any) => typeof t === 'string' ? t : t.tag),
      productLink: p.productLink ?? '',
    }));
  } catch {
    const mod = await import('../data/postData.json');
    const all = mod.default as Post[];
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 12;
    return all.slice((page - 1) * limit, page * limit);
  }
}

export async function getPostBySlugSafe(slug: string): Promise<Post | null> {
  try {
    const q = new URLSearchParams();
    q.set('where[slug][equals]', slug);
    q.set('where[status][equals]', 'published');
    q.set('depth', '2');
    q.set('limit', '1');
    const res = await fetch(`${CMS_URL}/api/posts?${q}`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`CMS ${res.status}`);
    const data = await res.json();
    const p = data.docs[0];
    if (!p) return null;
    return {
      ...p,
      image: toAbsUrl(p.heroImage?.sizes?.card?.url ?? p.heroImage?.url),
      categories: [p.category?.name, p.subCategory?.name].filter(Boolean),
      tags: (p.tags || []).map((t: any) => typeof t === 'string' ? t : t.tag),
      productLink: p.productLink ?? '',
    };
  } catch {
    const mod = await import('../data/postData.json');
    return (mod.default as Post[]).find(p => p.slug === slug) ?? null;
  }
}

export async function getRelatedPostsSafe(slug: string, limit = 4): Promise<Post[]> {
  try {
    const post = await getPostBySlugSafe(slug);
    if (!post) return [];
    const catId = (post as any).category?.id;
    if (!catId) throw new Error('no category id');
    const q = new URLSearchParams();
    q.set('where[status][equals]', 'published');
    q.set('where[category][equals]', String(catId));
    q.set('where[slug][not_equals]', slug);
    q.set('limit', String(limit));
    q.set('depth', '2');
    const res = await fetch(`${CMS_URL}/api/posts?${q}`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`CMS ${res.status}`);
    const data = await res.json();
    return data.docs.map((p: any) => ({
      ...p,
      image: toAbsUrl(p.heroImage?.sizes?.card?.url ?? p.heroImage?.url),
      categories: [p.category?.name, p.subCategory?.name].filter(Boolean),
      tags: (p.tags || []).map((t: any) => typeof t === 'string' ? t : t.tag),
      productLink: p.productLink ?? '',
    }));
  } catch {
    const mod = await import('../data/postData.json');
    return (mod.default as Post[]).filter(p => p.slug !== slug).slice(0, limit);
  }
}

export async function searchPostsSafe(query: string): Promise<Post[]> {
  if (!query.trim()) return [];
  try {
    const q = new URLSearchParams();
    q.set('where[or][0][title][like]', query);
    q.set('where[or][1][description][like]', query);
    q.set('where[or][2][brand][like]', query);
    q.set('where[status][equals]', 'published');
    q.set('depth', '1');
    q.set('limit', '20');
    const res = await fetch(`${CMS_URL}/api/posts?${q}`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error(`CMS ${res.status}`);
    const data = await res.json();
    return data.docs.map((p: any) => ({
      ...p,
      image: toAbsUrl(p.heroImage?.sizes?.card?.url ?? p.heroImage?.url),
      categories: [p.category?.name, p.subCategory?.name].filter(Boolean),
      tags: (p.tags || []).map((t: any) => typeof t === 'string' ? t : t.tag),
      productLink: p.productLink ?? '',
    }));
  } catch {
    const mod = await import('../data/postData.json');
    const q = query.toLowerCase();
    return (mod.default as Post[]).filter(p =>
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
}
