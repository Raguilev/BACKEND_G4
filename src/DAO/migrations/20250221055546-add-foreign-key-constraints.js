'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /*await queryInterface.addConstraint("AccessLog",{
      name : "FK_ACCESSLOG_USER",
      type : "FOREIGN KEY",
      fields : ["user_id"],
      references : {
        table : "User",
        field : "id"
      }

    // Agrega FK en Category: user_id → User.id
    await queryInterface.addConstraint('Category', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'FK_CATEGORY_USER',
      references: {
        table: 'User',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Agrega FK en Expense: user_id → User.id
    await queryInterface.addConstraint('Expense', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'FK_EXPENSE_USER',
      references: {
        table: 'User',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Agrega FK en Expense: category_id → Category.id
    await queryInterface.addConstraint('Expense', {
      fields: ['category_id'],
      type: 'foreign key',
      name: 'FK_EXPENSE_CATEGORY',
      references: {
        table: 'Category',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Agrega FK en User: role_id → Role.id
    await queryInterface.addConstraint('User', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'FK_USER_ROLE',
      references: {
        table: 'Role',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });*/
  },

  async down (queryInterface, Sequelize) {
    /*await queryInterface.removeConstraint('AccessLog', 'FK_ACCESSLOG_USER');
    await queryInterface.removeConstraint('Category', 'FK_CATEGORY_USER');
    await queryInterface.removeConstraint('Expense', 'FK_EXPENSE_USER');
    await queryInterface.removeConstraint('Expense', 'FK_EXPENSE_CATEGORY');
    await queryInterface.removeConstraint('User', 'FK_USER_ROLE');*/
  }
};
