'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("Budget",{
      name : "FK_BUDGET_USER",
      type : "FOREIGN KEY",
      fields : ["user_id"],
      references : {
        table : "User",
        field : "id"
      }
    })

    await queryInterface.addConstraint("Budget",{
      name : "FK_BUDGET_CATEGORY",
      type : "FOREIGN KEY",
      fields : ["category_id"],
      references : {
        table : "Category",
        field : "id"
      }
    })

    await queryInterface.addConstraint("Password_reset",{
      name : "FK_PASSWORDRESET_USER",
      type : "FOREIGN KEY",
      fields : ["user_id"],
      references : {
        table : "User",
        field : "id"
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Budget', 'FK_BUDGET_USER');
    await queryInterface.removeConstraint('Budget', 'FK_BUDGET_CATEGORY');
    await queryInterface.removeConstraint('Password_reset', 'FK_PASSWORDRESET_USER');
  }
};