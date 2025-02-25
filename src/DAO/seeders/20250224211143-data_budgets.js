'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert("Budgets", [
     {
      category: "Ocio",
      amount: 129.99
     },
     {
      category: "Servicios",
      amount: 1229.99
     },
     {
      category: "Alimentación",
      amount: 779.99
     }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Budgets', null, {});
  }
};
