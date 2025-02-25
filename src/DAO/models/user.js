'use strict';
const {
  Model
} = require('sequelize');
const password_resets = require('./password_resets');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role,{
        foreignKey : "role_id",
        as : "User_Role"
      })
      User.hasMany(models.AccessLog,{
        foreignKey : "user_id",
        as : "User_AccessLog"
      })
      User.hasMany(models.Expense,{
        foreignKey : "user_id",
        as : "User_Expense"
      })
      User.hasMany(models.categories, {
        foreignKey : "user_id",
        as : "User_Category"
      })
      User.hasMany(models.budgets, {
        foreignKey : "user_id", 
        as : "User_Budget"
      })
      User.hasMany(models.password_resets, {
        foreignKey : "user_id",
        as : "User_PasswordReset"
      })
    }
    validPassword(password){
      return bcrypt.compareSync(password, this.password_hash);
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