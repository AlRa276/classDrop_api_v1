// src/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // <-- Importamos nodemailer para correos reales
const usuarioRepository = require('../repositories/usuario.repository');
const tokenRevocadoRepository = require('../repositories/tokenRevocado.repository');
const { hashToken } = require('../utils/tokenHash');

const DOMINIO_VALIDO = '@ids.upchiapas.edu.mx';
const DOMINIO_VALIDO_2 = '@it2id.upchiapas.edu.mx';
const SALT_ROUNDS = 10;

// Configuración del transportador de correos (Se lee de las variables de entorno)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // Tu correo emisor (ej: tu cuenta de Gmail)
    pass: process.env.EMAIL_PASSWORD   // Tu contraseña de aplicación generada en Google
  }
});

class AuthService {
  async registrar({ nombreCompleto, correo, contrasena }) {
    if (!correo.toLowerCase().endsWith(DOMINIO_VALIDO) && !correo.toLowerCase().endsWith(DOMINIO_VALIDO_2)) {
      const error = new Error('El correo debe ser institucional (@upchiapas.edu.mx)');
      error.status = 400;
      throw error;
    }

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
    if (!correo.toLowerCase().endsWith(DOMINIO_VALIDO)) {
      const error = new Error('El correo debe ser institucional (@upchiapas.edu.mx)');
      error.status = 400;
      throw error;
    }

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

  // --- LOGIN PRINCIPAL (CON ENVÍO DE CORREO REAL) ---
  async login({ correo, contrasena, fmcToken }) {
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

    let usuarioActualizado = usuario;
    if (fmcToken) {
      usuarioActualizado = await usuarioRepository.actualizar(usuario.id, { fmcToken });
    }

    // INTERCEPCIÓN DE SEGUNDO FACTOR ACTIVO
    if (usuario.isTwoFactorEnabled || usuario.is_two_factor_enabled) {
      const codigoLogin = Math.floor(100000 + Math.random() * 900000).toString();
      
      await usuarioRepository.actualizar(usuario.id, {
        twoFactorSecret: codigoLogin,
        two_factor_secret: codigoLogin
      });

      // Enviar el correo real al usuario intentando iniciar sesión
      try {
        await transporter.sendMail({
          from: `"Seguridad ClassDrop" <${process.env.EMAIL_USER}>`,
          to: usuario.correo,
          subject: 'Código de verificación de inicio de sesión - ClassDrop',
          html: `<p>Hola <b>${usuario.nombreCompleto}</b>,</p>
                 <p>Tu código de verificación de doble factor para iniciar sesión es:</p>
                 <h2>${codigoLogin}</h2>
                 <p>Este código vencerá pronto. Si no solicitaste este acceso, cambia tu contraseña.</p>`
        });
      } catch (mailError) {
        console.error('Error al enviar correo de login:', mailError);
        // Opcional: lanzar error si deseas bloquear el login si el correo falla
      }

      return {
        requires2FA: true,
        userId: usuario.id
      };
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      usuario: {
        id: usuarioActualizado.id,
        nombreCompleto: usuarioActualizado.nombreCompleto,
        correo: usuarioActualizado.correo,
        rol: usuarioActualizado.rol,
        fcmToken: usuarioActualizado.fcmToken,
      },
    };
  }

  // --- COMPROBACIÓN ESTRICTA DEL CÓDIGO EN EL LOGIN ---
  async login2FA(userId, tokenVerificacion) {
    const usuario = await usuarioRepository.buscarPorId(userId);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    const codigoGuardado = usuario.twoFactorSecret || usuario.two_factor_secret;
    
    if (!codigoGuardado || codigoGuardado !== tokenVerificacion) {
      const error = new Error('Código de verificación incorrecto o expirado');
      error.status = 401;
      throw error;
    }

    // Limpiamos el código usado para que no se use dos veces
    await usuarioRepository.actualizar(userId, {
      twoFactorSecret: null,
      two_factor_secret: null
    });

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
        fcmToken: usuario.fcmToken,
      },
    };
  }

  // --- GENERAR CÓDIGO DE ACTIVACIÓN Y ENVIAR AL CORREO REGISTRADO ---
  async generarEstructura2FA(usuarioId) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    const codigoCorreo = Math.floor(100000 + Math.random() * 900000).toString();
    
    await usuarioRepository.actualizar(usuarioId, {
      twoFactorSecret: codigoCorreo,
      two_factor_secret: codigoCorreo 
    });

    // Enviar el correo real con el código de activación
    await transporter.sendMail({
      from: `"Seguridad ClassDrop" <${process.env.EMAIL_USER}>`,
      to: usuario.correo, // Se envía al correo que el usuario registró
      subject: 'Activa la verificación en dos pasos - ClassDrop',
      html: `<p>Hola <b>${usuario.nombreCompleto}</b>,</p>
             <p>Estás configurando la verificación de dos pasos en tu cuenta. Tu código de activación es:</p>
             <h2 style="color: #4A90E2; font-size: 24px; letter-spacing: 2px;">${codigoCorreo}</h2>
             <p>Ingresa este código en la aplicación para activar el sistema.</p>`
    });

    return {
      success: true,
      mensaje: `Se ha enviado un código de verificación real a tu correo institucional (${usuario.correo}).`
    };
  }

  // --- COMPROBACIÓN ESTRICTA PARA ACTIVAR EL INTERRUPTOR ---
  async activar2FA(usuarioId, tokenVerificacion) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    const codigoGuardado = usuario.twoFactorSecret || usuario.two_factor_secret;
    
    if (!codigoGuardado || codigoGuardado !== tokenVerificacion) {
      const error = new Error('El código de verificación de correo es incorrecto.');
      error.status = 400;
      throw error;
    }

    // Activamos formalmente el doble factor
    await usuarioRepository.actualizar(usuarioId, {
      isTwoFactorEnabled: true,
      is_two_factor_enabled: true,
      twoFactorSecret: null, // Limpiamos el código de activación usado
      two_factor_secret: null
    });

    return {
      success: true,
      mensaje: 'Autenticación de doble factor por correo activada exitosamente.'
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

  async cerrarSesion(usuarioId, token) {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      const error = new Error('Token inválido');
      error.status = 400;
      throw error;
    }

    const expiraEn = new Date(decoded.exp * 1000);
    await tokenRevocadoRepository.revocar(hashToken(token), usuarioId, expiraEn);
    return true;
  }
}

module.exports = new AuthService();