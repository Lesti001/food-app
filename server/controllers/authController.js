const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Auth } = require('../models');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
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

async function register(req, res) {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: 'Name, username and password are required' });
  }

  const existing = await User.findOne({ where: { username } });
  if (existing) {
    return res.status(409).json({ message: 'An account with this username already exists' });
  }

  const user = await User.create({ username, name });
  const passwordHash = await bcrypt.hash(password, 10);
  await Auth.create({ password: passwordHash, userId: user.id });

  const token = signToken(user.id);
  return res.status(201).json({ token, user: serializeUser(user) });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = await User.findOne({ where: { username }, include: Auth });
  if (!user || !user.Auth) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const valid = await bcrypt.compare(password, user.Auth.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = signToken(user.id);
  return res.json({ token, user: serializeUser(user) });
}

module.exports = { register, login };
