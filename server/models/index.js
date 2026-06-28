const sequelize = require('../config/database');
const User = require('./User');
const Auth = require('./Auth');
const PublicFoods = require('./PublicFoods');
const PrivateFoods = require('./PrivateFoods');
const History = require('./History');

User.hasOne(Auth, { foreignKey: 'userId', onDelete: 'CASCADE' });
Auth.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(PrivateFoods, { foreignKey: 'userId', onDelete: 'CASCADE' });
PrivateFoods.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(History, { foreignKey: 'userId', onDelete: 'CASCADE' });
History.belongsTo(User, { foreignKey: 'userId' });


module.exports = {
  sequelize,
  User,
  Auth,
  PublicFoods,
  PrivateFoods,
  History,
};
