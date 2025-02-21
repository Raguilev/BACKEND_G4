'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('AccessLog', [
      // Registros del año pasado (2024) con firstaccess = true
      {
        user_id: 1,
        action: 'Login',
        firstaccess: true,
        access_time: '2024-11-01 08:30:00'
      },
      {
        user_id: 2,
        action: 'Login',
        firstaccess: true,
        access_time: '2024-12-02 09:15:00'
      },
      // Registro del año actual (2025) con firstaccess = true
      {
        user_id: 3,
        action: 'Login',
        firstaccess: true,
        access_time: '2025-01-03 14:20:00'
      },
      // Registros del año actual con acciones de Agregar, Editar y Borrar (al menos 10 en total)
      {
        user_id: 1,
        action: 'Agregar',
        firstaccess: false,
        access_time: '2025-01-05 10:00:00'
      },
      {
        user_id: 2,
        action: 'Editar',
        firstaccess: false,
        access_time: '2025-01-06 11:00:00'
      },
      {
        user_id: 3,
        action: 'Borrar',
        firstaccess: false,
        access_time: '2025-01-07 12:00:00'
      },
      {
        user_id: 1,
        action: 'Agregar',
        firstaccess: false,
        access_time: '2025-02-01 08:30:00'
      },
      {
        user_id: 2,
        action: 'Editar',
        firstaccess: false,
        access_time: '2025-02-02 09:30:00'
      },
      {
        user_id: 3,
        action: 'Borrar',
        firstaccess: false,
        access_time: '2025-02-03 10:30:00'
      },
      {
        user_id: 1,
        action: 'Agregar',
        firstaccess: false,
        access_time: '2025-03-01 07:30:00'
      },
      {
        user_id: 2,
        action: 'Editar',
        firstaccess: false,
        access_time: '2025-03-02 08:30:00'
      },
      {
        user_id: 3,
        action: 'Borrar',
        firstaccess: false,
        access_time: '2025-03-03 09:30:00'
      },
      {
        user_id: 1,
        action: 'Agregar',
        firstaccess: false,
        access_time: '2025-04-01 10:30:00'
      },
      {
        user_id: 2,
        action: 'Editar',
        firstaccess: false,
        access_time: '2025-04-02 11:30:00'
      },
      {
        user_id: 3,
        action: 'Borrar',
        firstaccess: false,
        access_time: '2025-04-03 12:30:00'
      },
      // Registros adicionales para cumplir con al menos 10 acciones de Agregar/Editar/Borrar
      {
        user_id: 1,
        action: 'Agregar',
        firstaccess: false,
        access_time: '2025-05-01 08:00:00'
      },
      {
        user_id: 2,
        action: 'Editar',
        firstaccess: false,
        access_time: '2025-05-02 09:00:00'
      },
      {
        user_id: 3,
        action: 'Borrar',
        firstaccess: false,
        access_time: '2025-05-03 10:00:00'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
