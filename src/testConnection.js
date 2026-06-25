// src/testConnection.js
const sequelize = require('./config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a PostgreSQL con Sequelize');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error(error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();