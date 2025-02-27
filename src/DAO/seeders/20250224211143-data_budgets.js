'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert("Budget", [
      { user_id: 2, category_id: 1, monthly_budget: 129.99 },
      { user_id: 3, category_id: 3, monthly_budget: 222.22 },
      { user_id: 2, category_id: 2, monthly_budget: 1229.99 },
      { user_id: 2, category_id: 3, monthly_budget: 779.99 },
      { user_id: 4, category_id: 1, monthly_budget: 350.00 }, // Agregar para usuario 4
      { user_id: 5, category_id: 2, monthly_budget: 540.00 }  // Agregar para usuario 5
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Budget', null, {});
  }
};