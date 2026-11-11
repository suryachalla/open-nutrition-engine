import type { FoodCategory, DietType, FoodItem } from '../types';
import { GRAINS } from './grains';
import { DAL } from './dal';
import { CURRIES } from './curries';
import { DAIRY } from './dairy';
import { SNACKS } from './snacks';
import { FRUITS } from './fruits';
import { NON_VEG } from './nonveg';
import { DRINKS_DESSERTS } from './drinksDesserts';
import EXTENDED_STAPLES from './extended_staples.json';

/**
 * Aggregated local food database. Contains 2,500 instant in-memory fitness
 * and Indian staples with Hindi names, serving sizes, and exact macros.
 */
export const FOODS: FoodItem[] = [
  ...GRAINS,
  ...DAL,
  ...CURRIES,
  ...DAIRY,
  ...SNACKS,
  ...FRUITS,
  ...NON_VEG,
  ...DRINKS_DESSERTS,
  ...(EXTENDED_STAPLES as unknown as FoodItem[]),
];

/** Fast lookup by stable food id. */
const FOOD_INDEX = new Map(FOODS.map((food) => [food.id, food]));

export const getFoodById = (id: string): FoodItem | undefined => FOOD_INDEX.get(id);

/** Count of foods in the database (exposed for future UI/stats use). */
export const FOOD_COUNT = FOODS.length;

/** Shared filter options used by the search UI. */
export type DietFilter = 'all' | DietType;
export type CategoryFilter = 'all' | FoodCategory;

export interface FoodSearchFilters {
  query: string;
  category: CategoryFilter;
  diet: DietFilter;
}

/** Filter the database by text (name or Hindi name) and facet filters with relevance ranking. */
export const searchFoods = ({ query, category, diet }: FoodSearchFilters): FoodItem[] => {
  const q = query.trim().toLowerCase();

  const filtered = FOODS.filter((food) => {
    if (category !== 'all' && food.category !== category) return false;
    if (diet !== 'all' && food.diet !== diet) return false;
    if (q === '') return true;
    return (
      food.name.toLowerCase().includes(q) ||
      (food.hindiName !== undefined && food.hindiName.toLowerCase().includes(q)) ||
      (food.aliases !== undefined && food.aliases.some((alias) => alias.toLowerCase().includes(q)))
    );
  });

  if (q === '') return filtered;

  return filtered.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // 1. Exact match
    const aExact = aName === q;
    const bExact = bName === q;
    if (aExact !== bExact) return aExact ? -1 : 1;

    // 2. Starts with query
    const aStarts = aName.startsWith(q);
    const bStarts = bName.startsWith(q);
    if (aStarts !== bStarts) return aStarts ? -1 : 1;

    // 3. Word boundary match (e.g. "Egg" matches "Boiled Egg" before "Eggplant")
    const wordRegex = new RegExp(`\\b${q}`, 'i');
    const aWord = wordRegex.test(aName);
    const bWord = wordRegex.test(bName);
    if (aWord !== bWord) return aWord ? -1 : 1;

    return aName.localeCompare(bName);
  });
};
