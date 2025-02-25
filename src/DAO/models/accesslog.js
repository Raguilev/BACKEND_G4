"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AccessLog extends Model {
    static associate(models) {
      AccessLog.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  AccessLog.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      action: { type: DataTypes.STRING, allowNull: false },
      firstaccess: { type: DataTypes.DATE, allowNull: false },
      access_time: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "AccessLog",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return AccessLog;
};
