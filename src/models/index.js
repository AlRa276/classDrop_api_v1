const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db');

const basename = path.basename(__filename);
const db = {};

// 1. Carga automática de todos los archivos *.model.js en esta carpeta
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.endsWith('.model.js')
    );
  })
  .forEach((file) => {
    console.log('Cargando:', file);
    const modelDef = require(path.join(__dirname, file));
    const model = modelDef(sequelize); // cada model.js exporta una función (sequelize) => Model
    db[model.name] = model;
  });

// 2. Ejecuta las asociaciones de cada model (si las define)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;