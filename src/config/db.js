// src/config/db.js
const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ [ERROR CRÍTICO] La variable DATABASE_URL está vacía en tu archivo .env");
  process.exit(1); 
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Esto soluciona tu error de "The server does not support SSL connections"
    }
  }
});

module.exports = sequelize;