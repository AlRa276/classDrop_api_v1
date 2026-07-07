// src/config/db.js
const { Sequelize } = require('sequelize');

// Metemos la URL pública real directo como texto para asegurar que la lea:
const urlPublica = 'postgresql://postgres:zeqpjqAkyfewoWJqikDvdFFJzAWdlHpr@hayabusa.proxy.rlwy.net:42946/railway';

const sequelize = new Sequelize(urlPublica, {
  dialect: 'postgres',
  logging: console.log, // 👈 Activamos esto para ver qué está haciendo en la consola
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;