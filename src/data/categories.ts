/**
 * The DRPZNE category tree.
 *
 * The CMS is the source of truth: the header, footer and category pages read categories from it.
 * This list is the fallback when the CMS has none yet (or can't be reached in local dev), and it
 * is what the CMS seed script (`pnpm seed:categories` in DRPZNE_CMS) creates.
 * Keep the two copies in sync if you change it.
 */
export interface CategoryNode {
  name: string;
  slug: string;
  children: { name: string; slug: string }[];
}

const tree: [string, string, string[]][] = [
  ['Tactical', 'tactical', ['Weapons', 'Hardware', 'Kit', 'Apparel', 'Accessories']],
  ['Style', 'style', ['Clothing', 'Footwear', 'Outerwear', 'Hats & Accessories', 'Grooming']],
  ['Tech', 'tech', ['Comms', 'Power', 'Optics', 'Drones', 'Smart Home']],
  ['Vehicles', 'vehicles', ['Trucks', 'Cars', 'Motorcycles', 'Off-Road', 'Mods & Parts']],
  ['Fitness', 'fitness', ['Supplements', 'Workout Gear', 'Recovery', 'Martial Arts']],
  ['Outdoors', 'outdoors', ['Camping', 'Hunting', 'Fishing', 'Survival', 'Overlanding']],
  ['Home', 'home', ['Kitchen Gear', 'Workspace', 'Workshop', 'Furniture']],
  ['Vices', 'vices', ['Whiskey', 'Cigars', 'Beer', 'Cannabis']],
  ['Drops', 'drops', ['New Drops', 'Limited Editions', 'Collabs', 'Flash Sales']],
];

/** Same rules as the CMS's generateSlug, so slugs match whichever side creates them. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const FALLBACK_CATEGORIES: CategoryNode[] = tree.map(([name, slug, subs]) => ({
  name,
  slug,
  children: subs.map((sub) => ({ name: sub, slug: slugify(sub) })),
}));
