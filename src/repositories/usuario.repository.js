// src/repositories/usuario.repository.js
const { Usuario } = require('../models');

class UsuarioRepository {
  async buscarPorCorreo(correo) {
    return await Usuario.findOne({ where: { correo } });
  }

  async buscarPorId(id) {
    return await Usuario.findByPk(id);
  }

  async crear(datosUsuario) {
    return await Usuario.create(datosUsuario);
  }

  async actualizar(id, datos) {
    const usuario = await this.buscarPorId(id);
    if (!usuario) return null;
    return await usuario.update(datos);
  }

  async eliminar(id) {
    const usuario = await this.buscarPorId(id);
    if (!usuario) return null;
    await usuario.destroy();
    return true;
  }

  async listarAdmins() {
    return await Usuario.findAll({ where: { rol: 'admin', activo: true } });
  }
}

module.exports = new UsuarioRepository();