'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Budget.init({
    user_id: DataTypes.INTEGER,
    monthly_budget: DataTypes.FLOAT,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Budget',
    freezeTableName : true,
    timestamps : false,
  });
  return Budget;
};