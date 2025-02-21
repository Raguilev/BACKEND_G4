'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Expense.belongsTo(models.Category,{
        foreignKey : "category_id"
      })
      Expense.belongsTo(models.User,{
        foreignKey : "user_id"
      })
    }
  }
  Expense.init({
    user_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    amount: DataTypes.DECIMAL,
    description: DataTypes.TEXT,
    recurring: DataTypes.BOOLEAN,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Expense',
    timestamps : false,
    freezeTableName: true
  });
  return Expense;
};