const authService = require('../services/auth.service');
const { created, ok } = require('../utils/apiResponse');

class AuthController {
  async registrar(req, res, next) {
    try {
      const usuario = await authService.registrar(req.body);
      return created(res, {
        id: usuario.id,
        nombreCompleto: usuario.nombreCompleto,
        correo: usuario.correo,
      });
    } catch (err) {
      next(err);
    }
  }

  async registrarAdmin(req, res, next) {
    try {
      const usuario = await authService.registrarAdmin(req.body);
      return created(res, {
        id: usuario.id,
        nombreCompleto: usuario.nombreCompleto,
        correo: usuario.correo,
        rol: usuario.rol,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const resultado = await authService.login(req.body);
      return ok(res, resultado);
    } catch (err) {
      next(err);
    }
  }

  async perfil(req, res, next) {
    try {
      // req.usuario lo va a inyectar el middleware de auth (JWT) más adelante
      const usuario = await authService.obtenerPerfil(req.usuario.id);
      return ok(res, usuario);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      await authService.cerrarSesion(req.usuario.id, req.token);
      return ok(res, { mensaje: 'Sesión cerrada correctamente' });
    } catch (err) {
      next(err);
    }
  }

  async actualizarFcmToken(req, res, next) {
    try {
      const { fmcToken } = req.body;
      
      if (!fmcToken) {
        const error = new Error('El token FCM es requerido');
        error.status = 400;
        throw error;
      }

      const resultado = await authService.actualizarFcmToken(req.usuario.id, fmcToken);
      return ok(res, resultado);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();