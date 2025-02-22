'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("AccessLog",{
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
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('AccessLog', 'FK_ACCESSLOG_USER');
    await queryInterface.removeConstraint('Expense', 'FK_EXPENSE_USER');
  }
};
