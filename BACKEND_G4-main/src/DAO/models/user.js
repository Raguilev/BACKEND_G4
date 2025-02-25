'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role,{
        foreignKey : "role_id"
      })
      User.hasMany(models.AccessLog,{
        foreignKey : "user_id"
      })
      User.hasMany(models.Expense,{
        foreignKey : "user_id"
      })
      User.hasMany(models.Password_reset,{
        foreignKey : "user_id"
      })
      User.hasMany(models.Budget,{
        foreignKey : "user_id"
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
    timestamps: false   
  });
  return User;
};