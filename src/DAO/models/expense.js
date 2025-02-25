"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.User, { foreignKey: "user_id" });
      Expense.belongsTo(models.Category, { foreignKey: "category_id" });
    }
  }

  Expense.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      recurring: { type: DataTypes.BOOLEAN, defaultValue: false },
      category_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Expense",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Expense;
};
