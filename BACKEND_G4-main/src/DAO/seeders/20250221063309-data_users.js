'use strict';

const bcrypt = require('bcrypt'); // Importa bcrypt

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10; // Define la cantidad de rondas para bcrypt

    // 🔹 Encriptar contraseñas antes de insertarlas
    const passwordAdmin = await bcrypt.hash('admin', saltRounds);
    const passwordSoda = await bcrypt.hash('soda', saltRounds);
    const passwordMaria = await bcrypt.hash('Maria', saltRounds);
    const passwordJuan = await bcrypt.hash('Juan', saltRounds);
    const passwordJose = await bcrypt.hash('Jose', saltRounds);

    await queryInterface.bulkInsert("Role", [
      { name: "admin" },
      { name: "user" }
    ]);

    return await queryInterface.bulkInsert('User', [
      { name: 'admin', email: 'admin@', password_hash: passwordAdmin, role_id: 1, verified: true },
      { name: 'soda', email: 'soda@', password_hash: passwordSoda, role_id: 2, verified: true },
      { name: 'Maria', email: 'Maria@', password_hash: passwordMaria, role_id: 2, verified: true },
      { name: 'Juan', email: 'Juan@', password_hash: passwordJuan, role_id: 2, verified: true },
      { name: 'Jose', email: 'Jose@', password_hash: passwordJose, role_id: 2, verified: true }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  }
};
