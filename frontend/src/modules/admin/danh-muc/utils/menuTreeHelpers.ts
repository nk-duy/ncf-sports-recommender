import { MegaMenuSport } from '../types';

export function computeMatchedSportIndices(
  menu: MegaMenuSport[],
  searchQuery: string
): number[] {
  if (!searchQuery.trim()) return menu.map((_, i) => i);

  const q = searchQuery.toLowerCase().trim();
  const matches: number[] = [];

  menu.forEach((sport, sIdx) => {
    const matchSport = sport.sport_type.toLowerCase().includes(q);
    const matchType = sport.product_types?.some((p) =>
      p.product_type.toLowerCase().includes(q)
    );
    const matchCat = sport.product_types?.some((p) =>
      p.categories?.some((c) => c.category.toLowerCase().includes(q))
    );

    if (matchSport || matchType || matchCat) {
      matches.push(sIdx);
    }
  });

  return matches;
}

export function swapItems<T>(arr: T[], idx: number, direction: 'up' | 'down'): T[] {
  const copy = [...arr];
  if (direction === 'up' && idx > 0) {
    [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
  } else if (direction === 'down' && idx < copy.length - 1) {
    [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
  }
  return copy;
}
