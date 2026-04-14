/**
 * Sanity client for DRPZNE frontend
 * 
 * Set these in your .env:
 *   PUBLIC_SANITY_PROJECT_ID=your_project_id
 *   PUBLIC_SANITY_DATASET=production
 */

const PROJECT_ID = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const DATASET = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const API_VERSION = '2024-01-01';

// Build a Sanity CDN URL for image assets
export function urlFor(source: { asset?: { _ref?: string } } | string | null | undefined): string {
  if (!source) return '/placeholder.jpg';
  const ref = typeof source === 'string' ? source : source?.asset?._ref;
  if (!ref) return '/placeholder.jpg';
  // ref format: image-{id}-{width}x{height}-{format}
  const [, id, dimensions, format] = ref.split('-');
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${format}`;
}

// Raw GROQ fetch
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!PROJECT_ID) throw new Error('PUBLIC_SANITY_PROJECT_ID not set');
  
  const encodedQuery = encodeURIComponent(query);
  const paramStr = Object.keys(params).length
    ? '&' + Object.entries(params).map(([k, v]) => `$${k}=${encodeURIComponent(JSON.stringify(v))}`).join('&')
    : '';

  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodedQuery}${paramStr}`;
  
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
  const json = await res.json();
  return json.result as T;
}

// GROQ Queries
export const queries = {
  allPosts: `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      description,
      "image": mainImage.asset->url,
      "images": images[].asset->url,
      price,
      productLink,
      brand,
      "categories": categories[]->name,
      tags,
      featured
    }
  `,

  postBySlug: `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      description,
      body,
      "image": mainImage.asset->url,
      "images": images[].asset->url,
      price,
      productLink,
      brand,
      "categories": categories[]->name,
      tags,
      featured
    }
  `,

  relatedPosts: `
    *[_type == "post" && slug.current != $slug && count((categories[]->name)[@ in $categories]) > 0]
    | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      description,
      "image": mainImage.asset->url,
      price,
      productLink,
      brand,
      "categories": categories[]->name,
      tags
    }
  `,

  postsByCategory: `
    *[_type == "post" && $category in categories[]->slug.current]
    | order(publishedAt desc)[$from...$to] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      description,
      "image": mainImage.asset->url,
      price,
      productLink,
      brand,
      "categories": categories[]->name,
      tags
    }
  `,

  searchPosts: `
    *[_type == "post" && (
      title match $q ||
      description match $q ||
      $q in tags
    )] | order(publishedAt desc)[0...20] {
      _id,
      title,
      "slug": slug.current,
      "image": mainImage.asset->url,
      "categories": categories[]->name,
    }
  `,
}
