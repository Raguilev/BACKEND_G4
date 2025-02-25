'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsTo(models.Expense,{
        foreignKey : "user_id", 
        as : "Categoria_Usuario"
      })
      Category.hasMany(models.budgets,{
        foreignKey : "category_id",
        as : "Category_Expense"
      })
      Category.hasMany(models.budgets,{
        foreignKey : "category_id",
        as : "Category_Budget"
      })
    }
  }
  Category.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
    freezeTableName: true,
    timestamps: false   
  });
  return Category;
};