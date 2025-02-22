'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("User",{
      name : "FK_USER_ROLE",
      type : "FOREIGN KEY",
      fields : ["role_id"],
      references : {
        table : "Role",
        field : "id"
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('User', 'FK_USER_ROLE');
  }
};
