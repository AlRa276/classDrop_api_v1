// src/controllers/auth.controller.js
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
      console.log('Body del login:', req.body); // DEBUG
      const resultado = await authService.login(req.body);
      
      if (resultado.requires2FA) {
        return ok(res, {
          requires2FA: true,
          userId: resultado.userId,
          mensaje: 'Se requiere código de verificación en dos pasos (2FA)'
        });
      }

      return ok(res, resultado);
    } catch (err) {
      next(err);
    }
  }

  async login2FA(req, res, next) {
    try {
      const { userId, token } = req.body;
      const resultado = await authService.login2FA(userId, token);
      return ok(res, resultado);
    } catch (err) {
      next(err);
    }
  }

  async generar2FA(req, res, next) {
    try {
      // Regresa a leer dinámicamente del token inyectado
      const resultado = await authService.generarEstructura2FA(req.usuario.id);
      return ok(res, resultado);
    } catch (err) {
      next(err);
    }
  }

  async activar2FA(req, res, next) {
    try {
      const { token } = req.body;
      const resultado = await authService.activar2FA(req.usuario.id, token);
      return ok(res, resultado);
    } catch (err) {
      next(err);
    }
  }

  async perfil(req, res, next) {
    try {
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
        const { fcmToken } = req.body;
        console.log('Token recibido en backend:', fcmToken); 

        const { Usuario } = require('../models');
        
        const usuario = await Usuario.findByPk(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        usuario.fcmToken = fcmToken;
        await usuario.save(); 
        
        return res.status(200).json({ message: 'FCM Token guardado' });
    } catch (err) {
        next(err);
    }
  }
}

module.exports = new AuthController();