/**
 * DRPZNE content API — reads from the Payload CMS REST API.
 *
 * Runs on the server only (pages and the /api/*.json endpoints), so the browser never talks to
 * the CMS directly. The CMS address comes from the CMS_URL environment variable.
 *
 * In local dev, if the CMS can't be reached, posts fall back to src/data/postData.json so you can
 * work on the UI offline. In production there is no fallback: an outage shows an empty state
 * instead of silently serving stale sample data.
 */
import { CMS_URL } from 'astro:env/server';
import { FALLBACK_CATEGORIES, type CategoryNode } from '../data/categories';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategoryRef {
  name: string;
  slug: string;
}

export interface Post {
  id?: string | number;
  title: string;
  slug: string;
  publishedAt: string;
  dropDate?: string;
  description: string;
  image: string;
  images: string[];
  productLink: string;
  price?: string;
  brand?: string;
  /** Primary category, then sub-category, when set */
  categories: CategoryRef[];
  tags: string[];
  featured?: boolean;
  affiliateDisclosure?: boolean;
}

export interface PostPage {
  posts: Post[];
  hasNextPage: boolean;
}

export const PLACEHOLDER_IMAGE = '/placeholder.svg';
const PAGE_SIZE = 12;

const cmsBase = CMS_URL.replace(/\/$/, '');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Payload returns media URLs relative to the CMS (local storage) or absolute (Vercel Blob). */
function toAbsUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//.test(url)) return url;
  return `${cmsBase}${url.startsWith('/') ? '' : '/'}${url}`;
}

function mediaUrl(media: any, size: 'card' | 'hero' = 'card'): string {
  if (!media || typeof media !== 'object') return PLACEHOLDER_IMAGE;
  return toAbsUrl(media.sizes?.[size]?.url ?? media.url);
}

function toCategoryRef(cat: any): CategoryRef | null {
  if (!cat || typeof cat !== 'object' || !cat.name) return null;
  return { name: cat.name, slug: cat.slug };
}

function normalizePost(p: any): Post {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    publishedAt: p.publishedAt ?? p.createdAt,
    dropDate: p.dropDate ?? undefined,
    description: p.description ?? '',
    image: mediaUrl(p.heroImage, 'hero'),
    images: (p.images ?? [])
      .map((i: any) => (i?.image ? mediaUrl(i.image, 'hero') : null))
      .filter(Boolean),
    productLink: p.productLink ?? '',
    price: p.price ?? undefined,
    brand: p.brand ?? undefined,
    categories: [toCategoryRef(p.category), toCategoryRef(p.subCategory)].filter(
      (c): c is CategoryRef => c !== null,
    ),
    tags: (p.tags ?? []).map((t: any) => (typeof t === 'string' ? t : t.tag)).filter(Boolean),
    featured: Boolean(p.featured),
    affiliateDisclosure: Boolean(p.affiliateDisclosure),
  };
}

async function cmsFetch<T>(path: string, params?: URLSearchParams): Promise<T> {
  const url = `${cmsBase}${path}${params ? `?${params}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`CMS ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

/** Only published posts are visible to the public API, but ask explicitly anyway. */
function publishedPostParams(): URLSearchParams {
  const q = new URLSearchParams();
  q.set('where[_status][equals]', 'published');
  q.set('depth', '2');
  return q;
}

// ─── Local dev fallback ───────────────────────────────────────────────────────

async function localPosts(): Promise<Post[]> {
  const mod = await import('../data/postData.json');
  return (mod.default as any[]).map((p) => ({
    ...p,
    images: p.images ?? [],
    productLink: p.productLink ?? '',
    categories: (p.categories ?? []).map((name: string) => ({ name, slug: name.toLowerCase() })),
    tags: p.tags ?? [],
  }));
}

async function withDevFallback<T>(label: string, run: () => Promise<T>, fallback: () => Promise<T>, empty: T): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(`[cms] ${label} failed, using local sample data:`, (err as Error).message);
      return fallback();
    }
    console.error(`[cms] ${label} failed:`, err);
    return empty;
  }
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(opts: {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
} = {}): Promise<PostPage> {
  const page = opts.page ?? 1;
  const limit = opts.limit ?? PAGE_SIZE;

  return withDevFallback(
    'getPosts',
    async () => {
      const q = publishedPostParams();
      q.set('sort', '-publishedAt');
      q.set('limit', String(limit));
      q.set('page', String(page));
      if (opts.subCategory) {
        q.set('where[subCategory.slug][equals]', opts.subCategory);
      } else if (opts.category) {
        q.set('where[or][0][category.slug][equals]', opts.category);
        q.set('where[or][1][subCategory.slug][equals]', opts.category);
      }
      const data = await cmsFetch<any>('/api/posts', q);
      return { posts: data.docs.map(normalizePost), hasNextPage: Boolean(data.hasNextPage) };
    },
    async () => {
      let all = await localPosts();
      const slug = opts.subCategory ?? opts.category;
      if (slug) all = all.filter((p) => p.categories.some((c) => c.slug === slug));
      const start = (page - 1) * limit;
      return { posts: all.slice(start, start + limit), hasNextPage: start + limit < all.length };
    },
    { posts: [], hasNextPage: false },
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return withDevFallback(
    'getPostBySlug',
    async () => {
      const q = publishedPostParams();
      q.set('where[slug][equals]', slug);
      q.set('limit', '1');
      const data = await cmsFetch<any>('/api/posts', q);
      return data.docs[0] ? normalizePost(data.docs[0]) : null;
    },
    async () => (await localPosts()).find((p) => p.slug === slug) ?? null,
    null,
  );
}

export async function getRelatedPosts(post: Post, limit = 4): Promise<Post[]> {
  const primary = post.categories[0];
  if (!primary) return [];
  return withDevFallback(
    'getRelatedPosts',
    async () => {
      const q = publishedPostParams();
      q.set('where[category.slug][equals]', primary.slug);
      q.set('where[slug][not_equals]', post.slug);
      q.set('sort', '-publishedAt');
      q.set('limit', String(limit));
      const data = await cmsFetch<any>('/api/posts', q);
      return data.docs.map(normalizePost);
    },
    async () => (await localPosts()).filter((p) => p.slug !== post.slug).slice(0, limit),
    [],
  );
}

export async function searchPosts(query: string, limit = 8): Promise<Post[]> {
  const term = query.trim();
  if (!term) return [];
  return withDevFallback(
    'searchPosts',
    async () => {
      const q = publishedPostParams();
      q.set('where[or][0][title][like]', term);
      q.set('where[or][1][description][like]', term);
      q.set('where[or][2][brand][like]', term);
      q.set('depth', '1');
      q.set('limit', String(limit));
      const data = await cmsFetch<any>('/api/posts', q);
      return data.docs.map(normalizePost);
    },
    async () => {
      const t = term.toLowerCase();
      return (await localPosts())
        .filter((p) => p.title.toLowerCase().includes(t) || p.description.toLowerCase().includes(t))
        .slice(0, limit);
    },
    [],
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

let categoryCache: { at: number; tree: CategoryNode[] } | null = null;
const CATEGORY_TTL_MS = 5 * 60 * 1000;

/**
 * Top-level categories with their sub-categories, from the CMS.
 * Cached for a few minutes per server instance, since every page renders the header.
 * Falls back to the built-in tree when the CMS has no categories yet.
 */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  if (categoryCache && Date.now() - categoryCache.at < CATEGORY_TTL_MS) return categoryCache.tree;

  let tree = FALLBACK_CATEGORIES;
  try {
    const q = new URLSearchParams({ limit: '500', depth: '0', sort: 'name' });
    const data = await cmsFetch<any>('/api/categories', q);
    const docs: any[] = data.docs ?? [];
    const top = docs.filter((c) => !c.parent);
    if (top.length) {
      const order = FALLBACK_CATEGORIES.map((c) => c.slug);
      const rank = (slug: string) => (order.indexOf(slug) === -1 ? 999 : order.indexOf(slug));
      tree = top
        .sort((a, b) => rank(a.slug) - rank(b.slug))
        .map((c) => ({
          name: c.name,
          slug: c.slug,
          children: docs
            .filter((s) => s.parent === c.id)
            .map((s) => ({ name: s.name, slug: s.slug })),
        }));
    }
  } catch (err) {
    console.warn('[cms] getCategoryTree failed, using built-in categories:', (err as Error).message);
  }
  categoryCache = { at: Date.now(), tree };
  return tree;
}

/** Resolve /category/[cat] or /category/[cat]/[sub] to names for the page heading. */
export async function findCategory(catSlug: string, subSlug?: string) {
  const tree = await getCategoryTree();
  const cat = tree.find((c) => c.slug === catSlug);
  if (!cat) return null;
  const sub = subSlug ? cat.children.find((s) => s.slug === subSlug) : undefined;
  if (subSlug && !sub) return null;
  return { cat, sub };
}

// ─── Site settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  contactEmail?: string;
  socialLinks?: { instagram?: string; twitter?: string; tiktok?: string; youtube?: string };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await cmsFetch<SiteSettings>('/api/globals/site-settings', new URLSearchParams({ depth: '0' }));
  } catch {
    return {};
  }
}
