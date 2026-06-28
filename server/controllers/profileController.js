const { User } = require('../models');

function serializeProfile(user) {
  return {
    age: user.age,
    height: user.height,
    weight: user.weight,
    activityLevel: user.activityLevel,
    dailyCalorieGoal: user.dailyCalorieGoal,
    proteinGoal: user.proteinGoal,
    carbGoal: user.carbGoal,
    fatGoal: user.fatGoal,
  };
}

async function getProfile(req, res) {
  const user = await User.findByPk(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json(serializeProfile(user));
}

async function updateProfile(req, res) {
  const user = await User.findByPk(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { age, height, weight, activityLevel, dailyCalorieGoal, proteinGoal, carbGoal, fatGoal } = req.body;

  await user.update({
    ...(age !== undefined && { age }),
    ...(height !== undefined && { height }),
    ...(weight !== undefined && { weight }),
    ...(activityLevel !== undefined && { activityLevel }),
    ...(dailyCalorieGoal !== undefined && { dailyCalorieGoal }),
    ...(proteinGoal !== undefined && { proteinGoal }),
    ...(carbGoal !== undefined && { carbGoal }),
    ...(fatGoal !== undefined && { fatGoal }),
  });

  return res.json(serializeProfile(user));
}

module.exports = { getProfile, updateProfile };
