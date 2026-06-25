// src/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuario.repository');

const DOMINIO_VALIDO = '@ids.upchiapas.edu.mx';
const DOMINIO_VALIDO_2 = '@it2id.upchiapas.edu.mx';
const SALT_ROUNDS = 10;

class AuthService {
  async registrar({ nombreCompleto, correo, contrasena }) {
    // RN-01: correo institucional
    if (!correo.toLowerCase().endsWith(DOMINIO_VALIDO) && !correo.toLowerCase().endsWith(DOMINIO_VALIDO_2)) {
      const error = new Error('El correo debe ser institucional (@upchiapas.edu.mx)');
      error.status = 400;
      throw error;
    }

    // RN-02: no duplicados
    const existente = await usuarioRepository.buscarPorCorreo(correo);
    if (existente) {
      const error = new Error('El correo ya está registrado');
      error.status = 409;
      throw error;
    }

    const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const usuario = await usuarioRepository.crear({
      nombreCompleto,
      correo: correo.toLowerCase(),
      contrasenaHash,
    });

    return usuario;
  }

  async registrarAdmin({ nombreCompleto, correo, contrasena}){
    // RN-01: correo institucional
    if (!correo.toLowerCase().endsWith(DOMINIO_VALIDO)) {
      const error = new Error('El correo debe ser institucional (@upchiapas.edu.mx)');
      error.status = 400;
      throw error;
    }

    // RN-02: no duplicados
    const existente = await usuarioRepository.buscarPorCorreo(correo);
    if (existente) {
      const error = new Error('El correo ya está registrado');
      error.status = 409;
      throw error;
    }

    const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const usuario = await usuarioRepository.crear({
      nombreCompleto,
      correo: correo.toLowerCase(),
      contrasenaHash,
      rol: 'admin',
    });

    return usuario;
  }

  async login({ correo, contrasena }) {
    const usuario = await usuarioRepository.buscarPorCorreo(correo.toLowerCase());

    if (!usuario) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    if (!usuario.activo) {
      const error = new Error('Esta cuenta está desactivada');
      error.status = 403;
      throw error;
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasenaHash);
    if (!coincide) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombreCompleto: usuario.nombreCompleto,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }

  async obtenerPerfil(usuarioId) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }
    return {
      id: usuario.id,
      nombreCompleto: usuario.nombreCompleto,
      correo: usuario.correo,
      rol: usuario.rol,
      avatarUrl: usuario.avatarUrl,
    };
  }
}

module.exports = new AuthService();