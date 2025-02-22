'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Category', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      }
    });
    /*await queryInterface.addConstraint("Expense",{
      name : "FK_EXPENSE_CATEGORY",
      type : "FOREIGN KEY",
      fields : ["category_id"],
      references : {
        table : "Category",
        field : "id"
      }
    })*/
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Category');
  }
};