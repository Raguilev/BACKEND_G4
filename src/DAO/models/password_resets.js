'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Password_resets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Password_resets.belongsTo(models.User, {
        foreignKey:'user_id',
        as:'ContraseñaUser'
      });
    }
  }
  
  Password_resets.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Password_resets',
    timestamps: false,
    freezeTableName: true
  });
  return Password_resets;
};

export default Password_resets;