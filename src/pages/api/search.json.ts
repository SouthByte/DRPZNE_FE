import type { APIRoute } from 'astro';
import { searchPosts } from '../../lib/api';

// Header search. Runs on the server so the browser never calls the CMS directly.
export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') ?? '').slice(0, 100);
  const posts = await searchPosts(q, 6);
  const results = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    image: p.image,
    categories: p.categories.map((c) => c.name),
  }));
  return new Response(JSON.stringify(results), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
};
