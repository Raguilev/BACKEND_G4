'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budgets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Budgets.belongsTo(models.category_id, {
        foreignKey: "user_id",
        as: 'Budget_User'
      })  
      
    }
  }
  Budgets.init({
    user_id: DataTypes.INTEGER,
    monthly_budget: DataTypes.DECIMAL,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Budgets',
    freezeTableName: true
  });
  return Budgets;
 }; 