const crypto = require('crypto');
const { Op } = require('sequelize');
const { History } = require('../models');

function emptyTotals() {
  return { calories: 0, protein: 0, carbs: 0, fat: 0 };
}

function recalcTotals(entries) {
  return entries.reduce((totals, entry) => ({
    calories: totals.calories + (entry.macros?.calories ?? 0),
    protein: totals.protein + (entry.macros?.protein ?? 0),
    carbs: totals.carbs + (entry.macros?.carbs ?? 0),
    fat: totals.fat + (entry.macros?.fat ?? 0),
  }), emptyTotals());
}

function serializeDay(date, history) {
  const entries = history?.entries ?? [];
  return { date, entries, totals: recalcTotals(entries) };
}

async function getDailyLog(req, res) {
  const { date } = req.params;
  const history = await History.findOne({ where: { userId: req.userId, date } });
  return res.json(serializeDay(date, history));
}

async function getHistorySummary(req, res) {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: 'start and end are required' });
  }

  const histories = await History.findAll({
    where: { userId: req.userId, date: { [Op.between]: [start, end] } },
    attributes: ['date', 'calories'],
  });

  return res.json(histories.map((h) => ({ date: h.date, calories: h.calories })));
}

async function addLogEntry(req, res) {
  const { foodItem, mealType, portionGrams, macros, date } = req.body;

  if (!date || !macros) {
    return res.status(400).json({ message: 'date and macros are required' });
  }

  const entry = {
    id: crypto.randomUUID(),
    foodItem,
    mealType,
    portionGrams,
    macros,
    date,
  };

  let history = await History.findOne({ where: { userId: req.userId, date } });
  const entries = [...(history?.entries ?? []), entry];
  const totals = recalcTotals(entries);

  if (history) {
    await history.update({
      entries,
      calories: totals.calories,
      protein: totals.protein,
      carbohydrates: totals.carbs,
      fat: totals.fat,
    });
  } else {
    history = await History.create({
      userId: req.userId,
      date,
      entries,
      calories: totals.calories,
      protein: totals.protein,
      carbohydrates: totals.carbs,
      fat: totals.fat,
    });
  }

  return res.status(201).json(serializeDay(date, history));
}

async function updateLogEntry(req, res) {
  const { id } = req.params;
  const { mealType } = req.body;

  if (!mealType) {
    return res.status(400).json({ message: 'mealType is required' });
  }

  const histories = await History.findAll({ where: { userId: req.userId } });
  const history = histories.find((h) => (h.entries ?? []).some((e) => e.id === id));

  if (!history) {
    return res.status(404).json({ message: 'Log entry not found' });
  }

  const entries = history.entries.map((e) => (e.id === id ? { ...e, mealType } : e));
  await history.update({ entries });

  return res.json(serializeDay(history.date, history));
}

async function deleteLogEntry(req, res) {
  const { id } = req.params;

  const histories = await History.findAll({ where: { userId: req.userId } });
  const history = histories.find((h) => (h.entries ?? []).some((e) => e.id === id));

  if (!history) {
    return res.status(404).json({ message: 'Log entry not found' });
  }

  const entries = history.entries.filter((e) => e.id !== id);

  if (entries.length === 0) {
    // Don't keep an empty row around just to store zeroed-out totals
    await history.destroy();
  } else {
    const totals = recalcTotals(entries);
    await history.update({
      entries,
      calories: totals.calories,
      protein: totals.protein,
      carbohydrates: totals.carbs,
      fat: totals.fat,
    });
  }

  return res.status(204).send();
}

module.exports = { getDailyLog, getHistorySummary, addLogEntry, updateLogEntry, deleteLogEntry };
