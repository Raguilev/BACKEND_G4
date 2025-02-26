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
      Budget.belongsTo(models.Category, {
        foreignKey: "category_id"
      })
      Budget.belongsTo(models.User, {
        foreignKey: "user_id"
    })
  }
}
  Budget.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User', 
        key: 'id'
      }
    },
    monthly_budget: DataTypes.FLOAT,
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category', 
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'Budget',
    freezeTableName : true,
    timestamps : false,
  });
  return Budget;
};