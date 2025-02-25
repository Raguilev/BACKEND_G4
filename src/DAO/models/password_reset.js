"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Password_reset extends Model {
    static associate(models) {
      Password_reset.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Password_reset.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      token: { type: DataTypes.STRING, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "Password_reset",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Password_reset;
};
