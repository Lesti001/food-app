const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
   type: DataTypes.UUID,
   defaultValue: DataTypes.UUIDV4,
   primaryKey: true 
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  activityLevel: {
    type: DataTypes.ENUM('sedentary', 'light', 'moderate', 'active', 'very_active'),
    allowNull: false,
    defaultValue: 'moderate'
  },
  dailyCalorieGoal: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  proteinGoal: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  carbGoal: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  fatGoal: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = User;