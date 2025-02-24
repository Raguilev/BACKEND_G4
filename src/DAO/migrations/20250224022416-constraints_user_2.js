'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("Password_reset",{
      name : "FK_PASSWORD_RESET_USER",
      type : "FOREIGN KEY",
      fields : ["user_id"],
      references : {
        table : "User",
        field : "id"
      }
    })

    await queryInterface.addConstraint("Budget",{
      name : "FK_BUDGET_USER",
      type : "FOREIGN KEY",
      fields : ["user_id"],
      references : {
        table : "User",
        field : "id"
      }
    })
  },

  

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Password_reset', 'FK_PASSWORD_RESET_USER');
    await queryInterface.removeConstraint('Budget', 'FK_BUDGET_USER');
  }
};
