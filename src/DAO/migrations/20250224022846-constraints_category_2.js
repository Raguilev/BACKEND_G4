'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("Budget",{
      name : "FK_BUDGET_CATEGORY",
      type : "FOREIGN KEY",
      fields : ["category_id"],
      references : {
        table : "Category",
        field : "id"
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Budget', 'FK_BUDGET_CATEGORY');
  }
};
