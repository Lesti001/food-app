// Bundled offline food database.
// Every item ships with the app, so search works with no network at all.
// Values are per 100 g (or per 100 ml for drinks). Sourced from common
// nutrition tables; treat as approximate.
//
// Shape matches what the app expects everywhere else:
//   { id, name, brand, source, per100g: { calories, protein, carbs, fat } }

function food(id, name, calories, protein, carbs, fat, brand = 'Generic') {
  return { id: `db-${id}`, name, brand, source: 'database', per100g: { calories, protein, carbs, fat } };
}

export const FOOD_DATABASE = [
  // ── Poultry & eggs ─────────────────────────────────────────────
  food('chicken-breast', 'Chicken Breast (Grilled)', 165, 31, 0, 3.6),
  food('chicken-thigh', 'Chicken Thigh (Roasted)', 209, 26, 0, 10.9),
  food('chicken-wing', 'Chicken Wing', 203, 30.5, 0, 8.1),
  food('turkey-breast', 'Turkey Breast (Roasted)', 135, 30, 0, 1),
  food('duck-breast', 'Duck Breast (Cooked)', 337, 19, 0, 28),
  food('egg-whole', 'Whole Egg (Large)', 143, 13, 0.7, 10),
  food('egg-white', 'Egg White', 52, 11, 0.7, 0.2),
  food('egg-scrambled', 'Scrambled Eggs', 149, 10, 1.6, 11),
  food('egg-boiled', 'Boiled Egg', 155, 13, 1.1, 11),

  // ── Red meat & pork ────────────────────────────────────────────
  food('beef-mince-lean', 'Lean Ground Beef (Cooked)', 217, 26, 0, 12),
  food('beef-steak', 'Beef Steak (Sirloin, Grilled)', 244, 27, 0, 15),
  food('beef-ribeye', 'Ribeye Steak (Grilled)', 291, 24, 0, 22),
  food('pork-chop', 'Pork Chop (Grilled)', 231, 26, 0, 14),
  food('pork-tenderloin', 'Pork Tenderloin (Roasted)', 143, 26, 0, 3.5),
  food('bacon', 'Bacon (Cooked)', 541, 37, 1.4, 42),
  food('ham', 'Ham (Sliced)', 145, 21, 1.5, 6),
  food('sausage-pork', 'Pork Sausage (Cooked)', 301, 18, 2, 24),
  food('salami', 'Salami', 336, 22, 2.4, 26),
  food('lamb-chop', 'Lamb Chop (Grilled)', 294, 25, 0, 21),

  // ── Fish & seafood ─────────────────────────────────────────────
  food('salmon', 'Salmon (Baked)', 206, 22, 0, 13),
  food('tuna-canned', 'Tuna (Canned in Water)', 116, 26, 0, 1),
  food('tuna-steak', 'Tuna Steak (Grilled)', 184, 30, 0, 6.3),
  food('cod', 'Cod (Baked)', 105, 23, 0, 0.9),
  food('tilapia', 'Tilapia (Cooked)', 129, 26, 0, 2.7),
  food('shrimp', 'Shrimp (Cooked)', 99, 24, 0.2, 0.3),
  food('mackerel', 'Mackerel (Cooked)', 262, 24, 0, 18),
  food('sardines', 'Sardines (Canned)', 208, 25, 0, 11),

  // ── Dairy ──────────────────────────────────────────────────────
  food('milk-whole', 'Whole Milk', 61, 3.2, 4.8, 3.3),
  food('milk-skim', 'Skim Milk', 34, 3.4, 5, 0.1),
  food('greek-yogurt', 'Greek Yogurt (Plain)', 59, 10, 3.6, 0.4, 'Chobani'),
  food('yogurt-plain', 'Yogurt (Plain)', 61, 3.5, 4.7, 3.3),
  food('cottage-cheese', 'Cottage Cheese', 98, 11, 3.4, 4.3),
  food('cheddar', 'Cheddar Cheese', 402, 25, 1.3, 33),
  food('mozzarella', 'Mozzarella', 280, 28, 3.1, 17),
  food('feta', 'Feta Cheese', 264, 14, 4.1, 21),
  food('parmesan', 'Parmesan', 431, 38, 4.1, 29),
  food('butter', 'Butter', 717, 0.9, 0.1, 81),
  food('cream-cheese', 'Cream Cheese', 342, 6, 4, 34),

  // ── Grains, bread & pasta ──────────────────────────────────────
  food('rice-white', 'White Rice (Cooked)', 130, 2.7, 28, 0.3),
  food('rice-brown', 'Brown Rice (Cooked)', 112, 2.6, 23, 0.9),
  food('oats', 'Oats (Rolled, Dry)', 389, 17, 66, 7),
  food('pasta', 'Pasta (Cooked)', 158, 6, 31, 0.9),
  food('spaghetti-wholewheat', 'Whole Wheat Pasta (Cooked)', 149, 6, 30, 1.3),
  food('bread-white', 'White Bread', 265, 9, 49, 3.2),
  food('bread-wholewheat', 'Whole Wheat Bread', 247, 13, 41, 3.4),
  food('bread-rye', 'Rye Bread', 259, 9, 48, 3.3),
  food('bagel', 'Bagel (Plain)', 250, 10, 49, 1.5),
  food('tortilla', 'Flour Tortilla', 306, 8, 51, 7),
  food('quinoa', 'Quinoa (Cooked)', 120, 4.4, 21, 1.9),
  food('couscous', 'Couscous (Cooked)', 112, 3.8, 23, 0.2),
  food('cornflakes', 'Cornflakes', 357, 7, 84, 0.4, 'Kelloggs'),
  food('granola', 'Granola', 471, 10, 64, 20),
  food('crackers', 'Crackers', 502, 9, 61, 25),

  // ── Legumes & plant protein ────────────────────────────────────
  food('lentils', 'Lentils (Cooked)', 116, 9, 20, 0.4),
  food('chickpeas', 'Chickpeas (Cooked)', 164, 8.9, 27, 2.6),
  food('black-beans', 'Black Beans (Cooked)', 132, 8.9, 24, 0.5),
  food('kidney-beans', 'Kidney Beans (Cooked)', 127, 8.7, 23, 0.5),
  food('tofu', 'Tofu (Firm)', 144, 17, 3, 9),
  food('tempeh', 'Tempeh', 192, 20, 7.6, 11),
  food('edamame', 'Edamame', 121, 12, 9, 5),
  food('hummus', 'Hummus', 166, 8, 14, 10),
  food('peanut-butter', 'Peanut Butter', 588, 25, 20, 50),

  // ── Nuts & seeds ───────────────────────────────────────────────
  food('almonds', 'Almonds', 579, 21, 22, 50),
  food('walnuts', 'Walnuts', 654, 15, 14, 65),
  food('cashews', 'Cashews', 553, 18, 30, 44),
  food('peanuts', 'Peanuts', 567, 26, 16, 49),
  food('pistachios', 'Pistachios', 560, 20, 28, 45),
  food('chia-seeds', 'Chia Seeds', 486, 17, 42, 31),
  food('flax-seeds', 'Flax Seeds', 534, 18, 29, 42),
  food('pumpkin-seeds', 'Pumpkin Seeds', 559, 30, 11, 49),
  food('sunflower-seeds', 'Sunflower Seeds', 584, 21, 20, 51),

  // ── Vegetables ─────────────────────────────────────────────────
  food('broccoli', 'Broccoli', 34, 2.8, 7, 0.4),
  food('spinach', 'Spinach', 23, 2.9, 3.6, 0.4),
  food('kale', 'Kale', 49, 4.3, 9, 0.9),
  food('carrot', 'Carrot', 41, 0.9, 10, 0.2),
  food('tomato', 'Tomato', 18, 0.9, 3.9, 0.2),
  food('cucumber', 'Cucumber', 15, 0.7, 3.6, 0.1),
  food('bell-pepper', 'Bell Pepper', 31, 1, 6, 0.3),
  food('onion', 'Onion', 40, 1.1, 9, 0.1),
  food('potato', 'Potato (Boiled)', 87, 1.9, 20, 0.1),
  food('sweet-potato', 'Sweet Potato (Baked)', 90, 2, 21, 0.2),
  food('zucchini', 'Zucchini', 17, 1.2, 3.1, 0.3),
  food('mushroom', 'Mushrooms', 22, 3.1, 3.3, 0.3),
  food('cauliflower', 'Cauliflower', 25, 1.9, 5, 0.3),
  food('green-beans', 'Green Beans', 31, 1.8, 7, 0.2),
  food('corn', 'Corn (Sweet)', 86, 3.2, 19, 1.2),
  food('peas', 'Green Peas', 81, 5.4, 14, 0.4),
  food('lettuce', 'Lettuce', 15, 1.4, 2.9, 0.2),
  food('avocado', 'Avocado', 160, 2, 9, 15),
  food('eggplant', 'Eggplant', 25, 1, 6, 0.2),
  food('asparagus', 'Asparagus', 20, 2.2, 3.9, 0.1),
  food('cabbage', 'Cabbage', 25, 1.3, 6, 0.1),
  food('beetroot', 'Beetroot', 43, 1.6, 10, 0.2),

  // ── Fruit ──────────────────────────────────────────────────────
  food('banana', 'Banana', 89, 1.1, 23, 0.3),
  food('apple', 'Apple', 52, 0.3, 14, 0.2),
  food('orange', 'Orange', 47, 0.9, 12, 0.1),
  food('strawberry', 'Strawberries', 32, 0.7, 7.7, 0.3),
  food('blueberry', 'Blueberries', 57, 0.7, 14, 0.3),
  food('grapes', 'Grapes', 69, 0.7, 18, 0.2),
  food('pineapple', 'Pineapple', 50, 0.5, 13, 0.1),
  food('mango', 'Mango', 60, 0.8, 15, 0.4),
  food('watermelon', 'Watermelon', 30, 0.6, 8, 0.2),
  food('pear', 'Pear', 57, 0.4, 15, 0.1),
  food('peach', 'Peach', 39, 0.9, 10, 0.3),
  food('kiwi', 'Kiwi', 61, 1.1, 15, 0.5),
  food('raspberry', 'Raspberries', 52, 1.2, 12, 0.7),
  food('cherry', 'Cherries', 63, 1.1, 16, 0.2),
  food('lemon', 'Lemon', 29, 1.1, 9, 0.3),
  food('dates', 'Dates', 282, 2.5, 75, 0.4),
  food('raisins', 'Raisins', 299, 3.1, 79, 0.5),

  // ── Fats & oils ────────────────────────────────────────────────
  food('olive-oil', 'Olive Oil', 884, 0, 0, 100),
  food('coconut-oil', 'Coconut Oil', 862, 0, 0, 100),
  food('mayonnaise', 'Mayonnaise', 680, 1, 0.6, 75),

  // ── Snacks & sweets ────────────────────────────────────────────
  food('dark-chocolate', 'Dark Chocolate (70%)', 598, 7.8, 46, 43),
  food('milk-chocolate', 'Milk Chocolate', 535, 7.6, 59, 30),
  food('potato-chips', 'Potato Chips', 536, 7, 53, 35),
  food('popcorn', 'Popcorn (Air-popped)', 387, 13, 78, 4.5),
  food('honey', 'Honey', 304, 0.3, 82, 0),
  food('jam', 'Jam / Fruit Preserve', 278, 0.4, 69, 0.1),
  food('ice-cream', 'Vanilla Ice Cream', 207, 3.5, 24, 11),
  food('protein-bar', 'Protein Bar', 350, 30, 38, 9),
  food('biscuit', 'Digestive Biscuit', 480, 6.5, 66, 21),

  // ── Prepared / fast food ───────────────────────────────────────
  food('pizza-margherita', 'Pizza (Margherita)', 266, 11, 33, 10),
  food('hamburger', 'Hamburger', 254, 13, 30, 9),
  food('french-fries', 'French Fries', 312, 3.4, 41, 15),
  food('sushi-roll', 'Sushi Roll', 145, 5.5, 28, 1.5),
  food('caesar-salad', 'Caesar Salad', 190, 5, 8, 15),
  food('fried-rice', 'Fried Rice', 174, 4, 27, 5.5),
  food('mac-and-cheese', 'Mac and Cheese', 164, 6.5, 20, 6.6),

  // ── Drinks ─────────────────────────────────────────────────────
  food('orange-juice', 'Orange Juice', 45, 0.7, 10, 0.2),
  food('apple-juice', 'Apple Juice', 46, 0.1, 11, 0.1),
  food('cola', 'Cola', 42, 0, 10.6, 0),
  food('beer', 'Beer', 43, 0.5, 3.6, 0),
  food('wine-red', 'Red Wine', 85, 0.1, 2.6, 0),
  food('coffee-black', 'Black Coffee', 2, 0.1, 0, 0),
  food('latte', 'Caffe Latte', 63, 3.4, 5, 3.3),
  food('almond-milk', 'Almond Milk (Unsweetened)', 15, 0.6, 0.6, 1.2),
  food('smoothie', 'Fruit Smoothie', 54, 1, 12, 0.5),
  food('sports-drink', 'Sports Drink', 26, 0, 6.5, 0),
];
