'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Role', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
    });
    /*await queryInterface.addConstraint("User",{
      name : "FK_USER_ROLE",
      type : "FOREIGN KEY",
      fields : ["role_id"],
      references : {
        table : "Role",
        field : "id"
      }
    })*/
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Role');
  }
};