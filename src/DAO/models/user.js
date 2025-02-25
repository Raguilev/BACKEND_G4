"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: "role_id" });
      User.hasMany(models.AccessLog, { foreignKey: "user_id" });
      User.hasMany(models.Expense, { foreignKey: "user_id" });
      User.hasMany(models.Password_reset, { foreignKey: "user_id" });
    }
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      role_id: { type: DataTypes.INTEGER, allowNull: false },
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      verification_token: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "User",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return User;
};
