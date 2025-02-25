'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert("Budget", [
     {
      user_id : 2,
      category_id: 1,
      monthly_budget: 129.99
     },
     {
      user_id : 2,
      category_id: 2,
      monthly_budget: 1229.99
     },
     {
      user_id : 2,
      category_id: 3,
      monthly_budget: 779.99
     }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Budget', null, {});
  }
};

