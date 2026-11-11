/**
 * Types for the Indian Food Calorie Calculator.
 *
 * Nutrition is stored per 100 g so the dataset can scale to thousands of
 * foods without schema changes - serving sizes are expressed as presets that
 * reference a gram amount and are resolved to absolute macros at add-time.
 */

export type DietType = 'veg' | 'non-veg';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type FoodCategory =
  | 'grains'
  | 'dal'
  | 'curry'
  | 'dairy'
  | 'snacks'
  | 'fruits'
  | 'non-veg'
  | 'drinks'
  | 'desserts';

/** A preset serving size a user can pick from (no manual gram entry). */
export interface FoodServing {
  /** Stable id, unique within a single food's `servings` list. */
  id: string;
  /** Human label, e.g. "1 bowl (240 g)". */
  label: string;
  /** Weight of this serving in grams. */
  amount: number;
}

/** A single food in the database. */
export interface FoodItem {
  id: string;
  name: string;
  /** Common Hindi/regional name, used for search. */
  hindiName?: string;
  category: FoodCategory;
  diet: DietType;
  servings: FoodServing[];
  /** Nutrition per 100 g. */
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber?: number; // g
  sugar?: number; // g
  aliases?: string[];
}

/** A single item in the user's daily food log (resolved to absolute values). */
export interface FoodLogEntry {
  id: string;
  foodId: string;
  foodName: string;
  /** The base serving the user picked, e.g. "1 piece (40 g)". */
  servingLabel: string;
  /** How many servings were added (e.g. 2 x "1 piece"). */
  quantity: number;
  /** Total grams for this entry (serving.amount * quantity). */
  amount: number;
  meal?: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

/** Aggregated daily totals across all logged entries. */
export interface FoodTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface FoodTrackerResult {
  id?: string;
  uid: string;
  calculatorType: 'food-tracker';
  inputs: {
    itemCount: number;
    foodNames: string[];
  };
  outputs: FoodTotals;
  createdAt: Date;
}
