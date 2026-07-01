const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // ponlo en console.log si quieres ver las queries SQL generadas

    dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Evita errores de certificados autofirmados en Render
            servername: process.env.DB_HOST
          }
        }
  }
  
);

module.exports = sequelize;