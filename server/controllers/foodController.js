const { Op } = require('sequelize');
const { PublicFoods, PrivateFoods } = require('../models');

function serializeFood(food, source) {
  return {
    id: food.id,
    source,
    name: food.name,
    brand: food.brand,
    per100g: {
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbohydrates,
      fat: food.fat,
    },
  };
}

async function searchFoods(req, res) {
  const { q } = req.query;
  const hasQuery = q && q.trim();
  const nameFilter = hasQuery ? { name: { [Op.iLike]: `%${q.trim()}%` } } : {};

  const [publicFoods, privateFoods] = await Promise.all([
    PublicFoods.findAll({ where: nameFilter, limit: 30, order: [['name', 'ASC']] }),
    PrivateFoods.findAll({ where: { ...nameFilter, userId: req.userId }, limit: 30, order: [['name', 'ASC']] }),
  ]);

  const results = [
    ...privateFoods.map((f) => serializeFood(f, 'private')),
    ...publicFoods.map((f) => serializeFood(f, 'public')),
  ];

  return res.json(results);
}

async function listPrivateFoods(req, res) {
  const foods = await PrivateFoods.findAll({ where: { userId: req.userId } });
  return res.json(foods.map((f) => serializeFood(f, 'private')));
}

async function createPrivateFood(req, res) {
  const { name, brand, calories, protein, carbs, fat } = req.body;

  if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
    return res.status(400).json({ message: 'name, calories, protein, carbs and fat are required' });
  }

  const food = await PrivateFoods.create({
    name,
    brand,
    calories,
    protein,
    carbohydrates: carbs,
    fat,
    userId: req.userId,
  });

  return res.status(201).json(serializeFood(food, 'private'));
}

async function deletePrivateFood(req, res) {
  const { id } = req.params;
  const food = await PrivateFoods.findOne({ where: { id, userId: req.userId } });

  if (!food) {
    return res.status(404).json({ message: 'Private food not found' });
  }

  await food.destroy();
  return res.status(204).send();
}

module.exports = { searchFoods, listPrivateFoods, createPrivateFood, deletePrivateFood };
