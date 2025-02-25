"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      Budget.belongsTo(models.User, { foreignKey: "user_id" });
      Budget.belongsTo(models.Category, { foreignKey: "category_id" });
    }
  }

  Budget.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      monthly_budget: { type: DataTypes.FLOAT, allowNull: false },
      category_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Budget",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Budget;
};
