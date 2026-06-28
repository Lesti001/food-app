const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const logRoutes = require('./routes/logRoutes');
const foodRoutes = require('./routes/foodRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use('/auth', authLimiter, authRoutes);
app.use('/profile', profileRoutes);
app.use('/log', logRoutes);
app.use('/foods', foodRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ message: 'Invalid request data' });
  }
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
