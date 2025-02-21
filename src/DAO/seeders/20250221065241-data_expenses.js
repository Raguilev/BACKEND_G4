'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    const categories = [];
    const userIds = [2, 3, 4, 5];
    const categoryNames = ['Libros', 'Servicios', 'Restaurante', 'Alquiler', 'Supermercado'];
    
    // Para cada usuario, creamos 5 categorías
    for (const userId of userIds) {
      for (const name of categoryNames) {
        categories.push({
          user_id: userId,
          name: name
        });
      }
    }
    
    await queryInterface.bulkInsert('Category', categories, {});

    return await queryInterface.bulkInsert('Expense', [
      // Gastos para usuario 2
      { user_id: 2, date: '2025-01-05', amount: 50.00, description: 'Compra de libros', recurring: false, category_id: 1 },
      { user_id: 2, date: '2025-01-10', amount: 60.00, description: 'Pago de servicios', recurring: true, category_id: 2 },
      { user_id: 2, date: '2025-01-15', amount: 70.00, description: 'Cena en restaurante', recurring: false, category_id: 3 },
      { user_id: 2, date: '2025-01-20', amount: 80.00, description: 'Alquiler', recurring: true, category_id: 4 },
      { user_id: 2, date: '2025-01-25', amount: 90.00, description: 'Compra en supermercado', recurring: false, category_id: 5 },
      { user_id: 2, date: '2025-02-05', amount: 55.00, description: 'Compra de libros', recurring: false, category_id: 1 },
      { user_id: 2, date: '2025-02-10', amount: 65.00, description: 'Pago de servicios', recurring: true, category_id: 2 },
      { user_id: 2, date: '2025-02-15', amount: 75.00, description: 'Cena en restaurante', recurring: false, category_id: 3 },
      { user_id: 2, date: '2025-02-20', amount: 85.00, description: 'Alquiler', recurring: true, category_id: 4 },
      { user_id: 2, date: '2025-02-25', amount: 95.00, description: 'Compra en supermercado', recurring: false, category_id: 5 },

      // Gastos para usuario 3
      { user_id: 3, date: '2025-01-03', amount: 52.00, description: 'Compra de libros', recurring: false, category_id: 1 },
      { user_id: 3, date: '2025-01-08', amount: 62.00, description: 'Pago de servicios', recurring: true, category_id: 2 },
      { user_id: 3, date: '2025-01-13', amount: 72.00, description: 'Cena en restaurante', recurring: false, category_id: 3 },
      { user_id: 3, date: '2025-01-18', amount: 82.00, description: 'Alquiler', recurring: true, category_id: 4 },
      { user_id: 3, date: '2025-01-23', amount: 92.00, description: 'Compra en supermercado', recurring: false, category_id: 5 },
      { user_id: 3, date: '2025-02-03', amount: 57.00, description: 'Compra de libros', recurring: false, category_id: 1 },
      { user_id: 3, date: '2025-02-08', amount: 67.00, description: 'Pago de servicios', recurring: true, category_id: 2 },
      { user_id: 3, date: '2025-02-13', amount: 77.00, description: 'Cena en restaurante', recurring: false, category_id: 3 },
      { user_id: 3, date: '2025-02-18', amount: 87.00, description: 'Alquiler', recurring: true, category_id: 4 },
      { user_id: 3, date: '2025-02-23', amount: 97.00, description: 'Compra en supermercado', recurring: false, category_id: 5 },

      // Gastos para usuario 4
      { user_id: 4, date: '2025-01-02', amount: 54.00, description: 'Compra de libros', recurring: false, category_id: 1 },
      { user_id: 4, date: '2025-01-07', amount: 64.00, description: 'Pago de servicios', recurring: true, category_id: 2 },
      { user_id: 4, date: '2025-01-12', amount: 74.00, description: 'Cena en restaurante', recurring: false, category_id: 3 },
      { user_id: 4, date: '2025-01-17', amount: 84.00, description: 'Alquiler', recurring: true, category_id: 4 },
      { user_id: 4, date: '2025-01-22', amount: 94.00, description: 'Compra en supermercado', recurring: false, category_id: 5 },
      { user_id: 4, date: '2025-02-02', amount: 59.00, description: 'Compra de libros', recurring: false, category_id: 1 },
      { user_id: 4, date: '2025-02-07', amount: 69.00, description: 'Pago de servicios', recurring: true, category_id: 2 },
      { user_id: 4, date: '2025-02-12', amount: 79.00, description: 'Cena en restaurante', recurring: false, category_id: 3 },
      { user_id: 4, date: '2025-02-17', amount: 89.00, description: 'Alquiler', recurring: true, category_id: 4 },
      { user_id: 4, date: '2025-02-22', amount: 99.00, description: 'Compra en supermercado', recurring: false, category_id: 5 },

      // Gastos para usuario 5
      { user_id: 5, date: '2025-01-04', amount: 56.00, description: 'Compra de libros', recurring: false, category_id: 1 },
      { user_id: 5, date: '2025-01-09', amount: 66.00, description: 'Pago de servicios', recurring: true, category_id: 2 },
      { user_id: 5, date: '2025-01-14', amount: 76.00, description: 'Cena en restaurante', recurring: false, category_id: 3 },
      { user_id: 5, date: '2025-01-19', amount: 86.00, description: 'Alquiler', recurring: true, category_id: 4 },
      { user_id: 5, date: '2025-01-24', amount: 96.00, description: 'Compra en supermercado', recurring: false, category_id: 5 },
      { user_id: 5, date: '2025-02-04', amount: 61.00, description: 'Compra de libros', recurring: false, category_id: 1 },
      { user_id: 5, date: '2025-02-09', amount: 71.00, description: 'Pago de servicios', recurring: true, category_id: 2 },
      { user_id: 5, date: '2025-02-14', amount: 81.00, description: 'Cena en restaurante', recurring: false, category_id: 3 },
      { user_id: 5, date: '2025-02-19', amount: 91.00, description: 'Alquiler', recurring: true, category_id: 4 },
      { user_id: 5, date: '2025-02-24', amount: 101.00, description: 'Compra en supermercado', recurring: false, category_id: 5 },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Expense', null, {});
    
  }
};
