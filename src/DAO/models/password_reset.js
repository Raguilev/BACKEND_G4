'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Password_reset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Password_reset.belongsTo (models.User,{
        foreignKey: "user_id"
      })
    }
  }
  Password_reset.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User', 
        key: 'id'
      }
    },
    token: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Password_reset',
    freezeTableName : true,
    timestamps : false,
  });
  return Password_reset;
};