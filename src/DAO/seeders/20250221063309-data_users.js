"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("User", [
      {
        id: 1,
        name: "admin",
        email: "admin@example.com",
        password_hash: "admin",  // Hashea esto luego con bcrypt
        role_id: 1,  // ⚠ Asegúrate de que este ID existe en la tabla Role
        verified: true,
        verification_token: null,
      },
      {
        id: 2,
        name: "roma",
        email: "roma@example.com",
        password_hash: "roma",
        role_id: 2,
        verified: true,
        verification_token: null,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("User", null, {});
  },
};
