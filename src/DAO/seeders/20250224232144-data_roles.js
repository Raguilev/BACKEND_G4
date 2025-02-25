'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Role', [
      { id: 1, name: 'admin' },
      { id: 2, name: 'user' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Role', null, {});
  }
};
