'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert("Role", [
      { name : "admin" },
      { name : "user" }
    ])

    return await queryInterface.bulkInsert('User', [ 
      { name: 'admin', email: 'admin@', password_hash: 'admin', role_id: 1 },
      { name: 'soda', email: 'soda@', password_hash: 'soda', role_id: 2 },
      { name: 'Maria', email: 'Maria@', password_hash: 'Maria', role_id: 2 },
      { name: 'Juan', email: 'Juan@', password_hash: 'Juan', role_id: 2 },
      { name: 'Jose', email: 'Jose@', password_hash: 'Jose', role_id: 2 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  }
};
