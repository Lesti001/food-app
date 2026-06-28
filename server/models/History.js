const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const History = sequelize.define('History', {
  id: {
   type: DataTypes.UUID,
   defaultValue: DataTypes.UUIDV4,
   primaryKey: true 
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  calories: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  protein: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  carbohydrates: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  fat: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  entries: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
}, {
  tableName: 'history',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['userId', 'date'] }
  ]
});

module.exports = History;