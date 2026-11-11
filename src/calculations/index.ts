import type {
  FoodItem,
  FoodLogEntry,
  FoodServing,
  FoodTotals,
  MealType,
} from '../types';

const round = (num: number, precision = 1): number => {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
};

/**
 * Build a food log entry from a food, one of its preset servings, a quantity,
 * and a meal. Nutrition is scaled linearly from the per-100 g figures and
 * multiplied by the chosen quantity of servings.
 */
export const createFoodEntry = (
  food: FoodItem,
  serving: FoodServing,
  quantity: number,
  meal: MealType = 'lunch'
): FoodLogEntry => {
  const factor = (serving.amount * quantity) / 100;
  return {
    id: crypto.randomUUID(),
    foodId: food.id,
    foodName: food.name,
    servingLabel: quantity > 1 ? `${quantity} × ${serving.label}` : serving.label,
    quantity,
    amount: serving.amount * quantity,
    meal,
    calories: round(food.calories * factor),
    protein: round(food.protein * factor),
    carbs: round(food.carbs * factor),
    fat: round(food.fat * factor),
    fiber: food.fiber !== undefined ? round(food.fiber * factor) : undefined,
    sugar: food.sugar !== undefined ? round(food.sugar * factor) : undefined,
  };
};

/** Aggregate all logged entries into daily calorie + macro totals. */
export const computeFoodTotals = (entries: FoodLogEntry[]): FoodTotals => {
  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
      fiber: (acc.fiber || 0) + (entry.fiber || 0),
      sugar: (acc.sugar || 0) + (entry.sugar || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );

  return {
    calories: Math.round(totals.calories),
    protein: round(totals.protein),
    carbs: round(totals.carbs),
    fat: round(totals.fat),
    fiber: round(totals.fiber),
    sugar: round(totals.sugar),
  };
};
