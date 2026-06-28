const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PublicFoods = sequelize.define('PublicFoods', {
  id: {
   type: DataTypes.UUID,
   defaultValue: DataTypes.UUIDV4,
   primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  calories: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
    protein: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
    carbohydrates: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
    fat: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'public_foods', 
  timestamps: false 
});

module.exports = PublicFoods;