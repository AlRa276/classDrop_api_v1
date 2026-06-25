// src/testModels.js (actualízalo)
const db = require('./models');

async function test() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    // Esto NO crea tablas, solo prueba una consulta real
    const cuatrimestres = await db.Cuatrimestre.findAll();
    console.log('Cuatrimestres encontrados:', cuatrimestres.length);

    const usuarios = await db.Usuario.findAll();
    console.log('Usuarios encontrados:', usuarios.length);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.sequelize.close();
  }
}

test();