"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Expense, { foreignKey: "category_id" });
      Category.hasMany(models.Budget, { foreignKey: "category_id" });
    }
  }

  Category.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Category",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Category;
};
