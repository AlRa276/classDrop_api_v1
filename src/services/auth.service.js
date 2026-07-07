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
  service: 'gmail', // 👈 Al dejar SOLO service: 'gmail', Nodemailer configura host y puertos en automático
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
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

  async login({ correo, contrasena, fmcToken, rememberMe }) {
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
  
    // 🛡️ REVISIÓN DIRECTA DEL DISPOSITIVO DE CONFIANZA (Para todos los usuarios):
    if (rememberMe && usuario.rememberToken) {
      // Verificamos si ese token sigue siendo válido
      const isValidToken = jwt.verify(usuario.rememberToken, process.env.JWT_SECRET, (err) => !err);
      
      if (isValidToken) {
        // 🎉 ¡Dispositivo de confianza! Entra directo sin código al Home
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
    }

    // 🛑 No es dispositivo de confianza o es la primera vez: OBLIGATORIO se genera y envía código por correo
    const codigoLogin = Math.floor(100000 + Math.random() * 900000).toString();
  
    await usuarioRepository.actualizar(usuario.id, {
      twoFactorSecret: codigoLogin,
      two_factor_secret: codigoLogin
    });
  
    try {
      await transporter.sendMail({
        from: `"Seguridad ClassDrop" <${process.env.EMAIL_USER}>`,
        to: usuario.correo,
        subject: 'Código de verificación de inicio de sesión - ClassDrop',
        // 👈 AGREGA ESTA LÍNEA (Versión sin HTML):
        text: `Hola ${usuario.nombreCompleto}, tu código de verificación para iniciar sesión en ClassDrop es: ${codigoLogin}`, 
        html: `<p>Hola <b>${usuario.nombreCompleto}</b>,</p>
               <p>Tu código de verificación de doble factor para iniciar sesión es:</p>
               <h2>${codigoLogin}</h2>
               <p>Este código vencerá pronto. Si no solicitaste este acceso, cambia tu contraseña.</p>`
      });
    } catch (mailError) {
      console.error('Error al enviar correo de login:', mailError);
    }
  
    return {
      requires2FA: true,
      userId: usuario.id
    };
  }

  async login2FA(userId, tokenVerificacion, rememberMe) {
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
  
    // Limpiar el código usado
    await usuarioRepository.actualizar(userId, {
      twoFactorSecret: null,
      two_factor_secret: null
    });
  
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  
    // 🔑 GUARDAR PERMISO DE CONFIANZA (Solo si se verificó una vez con código)
    let rememberToken = null;
    if (rememberMe) {
      rememberToken = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } // Válido por 30 días
      );
      await usuarioRepository.actualizar(userId, { rememberToken });
    }
  
    return {
      token,
      rememberToken, // Este lo guarda Android localmente para futuros inicios
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
      to: usuario.correo,
      subject: 'Código de verificación de inicio de sesión - ClassDrop',
      // 👈 AGREGA ESTA LÍNEA (Versión sin HTML):
      text: `Hola ${usuario.nombreCompleto}, tu código de verificación para iniciar sesión en ClassDrop es: ${codigoLogin}`, 
      html: `<p>Hola <b>${usuario.nombreCompleto}</b>,</p>
             <p>Tu código de verificación de doble factor para iniciar sesión es:</p>
             <h2>${codigoLogin}</h2>
             <p>Este código vencerá pronto. Si no solicitaste este acceso, cambia tu contraseña.</p>`
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
      twoFactorSecret: null,
      two_factor_secret: null
    });

    return {
      success: true,
      mensaje: 'Autenticación de doble factor por correo activada exitosamente.'
    };
  }

  // =========================================================================
  // 🔒 --- MÉTODOS COMPLETOS PARA LA RECUPERACIÓN DE CONTRASEÑA ---
  // =========================================================================

  async solicitarRecuperacion(correo) {
    const usuario = await usuarioRepository.buscarPorCorreo(correo.toLowerCase());
    if (!usuario) {
      const error = new Error('No se encontró ningún usuario con ese correo institucional.');
      error.status = 404;
      throw error;
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos de validez

    await usuarioRepository.actualizar(usuario.id, {
      tokenRecuperacion: codigo,
      token_recuperacion: codigo,
      tokenRecuperacionExpira: expira,
      token_recuperacion_expira: expira
    });

    await transporter.sendMail({
      from: `"Seguridad ClassDrop" <${process.env.EMAIL_USER}>`,
      to: usuario.correo,
      subject: 'Código de verificación de inicio de sesión - ClassDrop',
      // 👈 AGREGA ESTA LÍNEA (Versión sin HTML):
      text: `Hola ${usuario.nombreCompleto}, tu código de verificación para iniciar sesión en ClassDrop es: ${codigoLogin}`, 
      html: `<p>Hola <b>${usuario.nombreCompleto}</b>,</p>
             <p>Tu código de verificación de doble factor para iniciar sesión es:</p>
             <h2>${codigoLogin}</h2>
             <p>Este código vencerá pronto. Si no solicitaste este acceso, cambia tu contraseña.</p>`
    });

    return { success: true, mensaje: 'Código de recuperación enviado con éxito al correo institucional.' };
  }

  async verificarCodigoRecuperacion(correo, token) {
    const usuario = await usuarioRepository.buscarPorCorreo(correo.toLowerCase());
    if (!usuario) {
      const error = new Error('Usuario no encontrado.');
      error.status = 404;
      throw error;
    }

    const tokenGuardado = usuario.tokenRecuperacion || usuario.token_recuperacion;
    const expiraGuardado = usuario.tokenRecuperacionExpira || usuario.token_recuperacion_expira;

    if (!tokenGuardado || tokenGuardado !== token) {
      const error = new Error('El código de recuperación es incorrecto.');
      error.status = 400;
      throw error;
    }

    if (new Date() > new Date(expiraGuardado)) {
      const error = new Error('El código ha expirado. Solicita uno nuevo.');
      error.status = 400;
      throw error;
    }

    return { success: true, mensaje: 'Código verificado con éxito. Procede a cambiar tu contraseña.' };
  }

  async restablecerContrasena(correo, token, nuevaContrasena) {
    const usuario = await usuarioRepository.buscarPorCorreo(correo.toLowerCase());
    if (!usuario) {
      const error = new Error('Usuario no encontrado.');
      error.status = 404;
      throw error;
    }

    const tokenGuardado = usuario.tokenRecuperacion || usuario.token_recuperacion;
    const expiraGuardado = usuario.tokenRecuperacionExpira || usuario.token_recuperacion_expira;

    if (!tokenGuardado || tokenGuardado !== token) {
      const error = new Error('Operación inválida o código incorrecto.');
      error.status = 400;
      throw error;
    }

    if (new Date() > new Date(expiraGuardado)) {
      const error = new Error('El código ha expirado.');
      error.status = 400;
      throw error;
    }

    const contrasenaHash = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS);

    await usuarioRepository.actualizar(usuario.id, {
      contrasenaHash,
      contrasena_hash: contrasenaHash,
      tokenRecuperacion: null,
      token_recuperacion: null,
      tokenRecuperacionExpira: null,
      token_recuperacion_expira: null
    });

    return { success: true, mensaje: 'Tu contraseña ha sido restablecida exitosamente.' };
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