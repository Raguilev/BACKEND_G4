'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccessLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AccessLog.belongsTo(models.User,{
        foreignKey : "user_id",
      })
    }
  }
  AccessLog.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User', 
        key: 'id'
      }
    },
    action: DataTypes.STRING,
    firstaccess: DataTypes.BOOLEAN,
    access_time: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'AccessLog',
    freezeTableName: true,
    timestamps: false      
  });
  return AccessLog;
};