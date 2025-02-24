'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AccessLog', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.STRING
      },
      firstaccess: {
        type: Sequelize.BOOLEAN
      },
      access_time: {
        type: Sequelize.DATE
      },
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AccessLog');
  }
};