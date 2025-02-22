'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password_hash: {
        type: Sequelize.STRING
      },
      role_id: {
        type: Sequelize.INTEGER
      },
    });
    /*await queryInterface.addConstraint("AccessLog",{
      name : "FK_ACCESSLOG_USER",
      type : "FOREIGN KEY",
      fields : ["user_id"],
      references : {
        table : "User",
        field : "id"
      }
    })
    
    await queryInterface.addConstraint("Expense",{
      name : "FK_EXPENSE_USER",
      type : "FOREIGN KEY",
      fields : ["user_id"],
      references : {
        table : "User",
        field : "id"
      }
    })*/
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};