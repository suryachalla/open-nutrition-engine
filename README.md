# Open Indian Nutrition Engine

A free and open source Indian food nutrition database and macro calculation engine developed for strength athletes, coaches, and developers.

Official interactive food tracker and web application:
https://thebarbellcrew.com/food-tracker

## Features

* Over 2500 verified Indian food items including curries, dals, grains, dairy, snacks, and non veg staples.
* Preconfigured serving sizes with gram conversions (bowls, pieces, katoris, spoons).
* Dual language support with English names, Hindi names, and colloquial aliases.
* Complete macro calculations (calories, protein, carbohydrates, fats, and fiber).
* Search utility with smart matching and relevance ranking.

## Installation

```bash
npm install open-nutrition-engine
```

## Quick Start

```typescript
import { searchFoods, createFoodEntry, computeFoodTotals } from 'open-nutrition-engine';

// 1. Search for a food
const results = searchFoods({
  query: 'Paneer',
  category: 'all',
  diet: 'veg'
});

const paneer = results[0];
console.log(paneer.name, paneer.calories, paneer.protein);

// 2. Calculate macros for a serving
const entry = createFoodEntry(
  paneer,
  paneer.servings[0],
  2,
  'lunch'
);

console.log(entry.calories, entry.protein);

// 3. Compute meal totals
const totals = computeFoodTotals([entry]);
console.log(totals);
```

## Attribution and Project Links

Maintained by Surya Challa and TheBarbellCrew team.
Website: https://thebarbellcrew.com
Interactive Tools: https://thebarbellcrew.com/food-tracker
Exercise Guides: https://thebarbellcrew.com/exercise-101

## License

MIT License. Free to use in personal, open source, and commercial software.
