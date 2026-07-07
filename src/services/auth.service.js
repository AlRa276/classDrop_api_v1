// src/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const usuarioRepository = require('../repositories/usuario.repository');
const tokenRevocadoRepository = require('../repositories/tokenRevocado.repository');
const { hashToken } = require('../utils/tokenHash');
const db = require('../models');

const DOMINIO_VALIDO = '@ids.upchiapas.edu.mx';
const DOMINIO_VALIDO_2 = '@it2id.upchiapas.edu.mx';
const SALT_ROUNDS = 10;

const normalizeEmail = (correo = '') => String(correo).trim().toLowerCase();
const esCorreoAdmin = (correo = '') => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(adminEmail) && normalizeEmail(correo) === adminEmail;
};
const resolverRol = (correo = '', rolPorDefecto = 'estudiante') =>
  esCorreoAdmin(correo) ? 'admin' : rolPorDefecto;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class AuthService {
  async registrar({ nombreCompleto, correo, contrasena }) {
    const correoNormalizado = normalizeEmail(correo);

    if (!correoNormalizado.endsWith(DOMINIO_VALIDO) && !correoNormalizado.endsWith(DOMINIO_VALIDO_2)) {
      const error = new Error('El correo debe ser institucional (@upchiapas.edu.mx)');
      error.status = 400;
      throw error;
    }

    const existente = await usuarioRepository.buscarPorCorreo(correoNormalizado);
    if (existente) {
      const error = new Error('El correo ya está registrado');
      error.status = 409;
      throw error;
    }

    const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);
    const rol = resolverRol(correoNormalizado, 'estudiante');

    const usuario = await usuarioRepository.crear({
      nombreCompleto,
      correo: correoNormalizado,
      contrasenaHash,
      rol,
    });

    return usuario;
  }

  async registrarAdmin({ nombreCompleto, correo, contrasena}){
    const correoNormalizado = normalizeEmail(correo);

    if (!correoNormalizado.endsWith(DOMINIO_VALIDO) && !esCorreoAdmin(correoNormalizado)) {
      const error = new Error('El correo debe ser institucional (@upchiapas.edu.mx) o coincidir con ADMIN_EMAIL');
      error.status = 400;
      throw error;
    }

    if (!esCorreoAdmin(correoNormalizado)) {
      const error = new Error('Solo se permite crear el administrador con el correo configurado en el entorno');
      error.status = 403;
      throw error;
    }

    const existente = await usuarioRepository.buscarPorCorreo(correoNormalizado);
    if (existente) {
      const error = new Error('El correo ya está registrado');
      error.status = 409;
      throw error;
    }

    const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const usuario = await usuarioRepository.crear({
      nombreCompleto,
      correo: correoNormalizado,
      contrasenaHash,
      rol: 'admin',
    });

    return usuario;
  }

  async login({ correo, contrasena, fmcToken, rememberMe }) {
    const correoNormalizado = normalizeEmail(correo);
    const usuario = await usuarioRepository.buscarPorCorreo(correoNormalizado);
  
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
  
    if (fmcToken) {
      await usuarioRepository.actualizar(usuario.id, { fcmToken });
    }
    const rolFinal = resolverRol(usuario.correo, usuario.rol || 'estudiante');
    if (rolFinal !== usuario.rol) {
      await usuarioRepository.actualizar(usuario.id, { rol: rolFinal });
    }

    // Si el correo es el ADMIN_EMAIL, omitimos 2FA y devolvemos el token directamente
    if (esCorreoAdmin(correoNormalizado)) {
      const token = jwt.sign(
        { id: usuario.id, rol: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      let rememberToken = null;
      if (rememberMe) {
        rememberToken = jwt.sign(
          { id: usuario.id },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        await usuarioRepository.actualizar(usuario.id, { rememberToken });
      }

      return {
        token,
        rememberToken,
        usuario: {
          id: usuario.id,
          nombreCompleto: usuario.nombreCompleto,
          correo: usuario.correo,
          rol: 'admin',
          fcmToken: usuario.fcmToken,
        },
      };
    }

    // 🛡️ REVISIÓN DEL PERIODO DE 7 DÍAS
    if (usuario.rememberToken) {
      const isValidToken = jwt.verify(usuario.rememberToken, process.env.JWT_SECRET, (err) => !err);
      
      if (isValidToken) {
        const token = jwt.sign(
          { id: usuario.id, rol: rolFinal },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        return {
          token,
          usuario: {
            id: usuario.id,
            nombreCompleto: usuario.nombreCompleto,
            correo: usuario.correo,
            rol: rolFinal,
            fcmToken: usuario.fcmToken,
          },
        };
      }
    }

    // 🛑 Código obligatorio por correo si expiró o es primera vez
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
  
    await usuarioRepository.actualizar(userId, {
      twoFactorSecret: null,
      two_factor_secret: null
    });
  
    const rolFinal = resolverRol(usuario.correo, usuario.rol || 'estudiante');
    if (rolFinal !== usuario.rol) {
      await usuarioRepository.actualizar(userId, { rol: rolFinal });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: rolFinal },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  
    let rememberToken = null;
    if (rememberMe) {
      rememberToken = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // 👈 Configurado a 7 días para cumplir tu regla exacta
      );
      await usuarioRepository.actualizar(userId, { rememberToken });
    }
  
    return {
      token,
      rememberToken,
      usuario: {
        id: usuario.id,
        nombreCompleto: usuario.nombreCompleto,
        correo: usuario.correo,
        rol: rolFinal,
        fcmToken: usuario.fcmToken,
      },
    };
  }

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

    await transporter.sendMail({
      from: `"Seguridad ClassDrop" <${process.env.EMAIL_USER}>`,
      to: usuario.correo,
      subject: 'Código de activación 2FA - ClassDrop',
      text: `Hola ${usuario.nombreCompleto}, tu código de activación es: ${codigoCorreo}`, 
      html: `<p>Hola <b>${usuario.nombreCompleto}</b>,</p>
             <p>Tu código de activación de doble factor es:</p>
             <h2>${codigoCorreo}</h2>`
    });

    return {
      success: true,
      mensaje: `Se ha enviado un código de verificación real a tu correo institucional.`
    };
  }

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

  async solicitarRecuperacion(correo) {
    const usuario = await usuarioRepository.buscarPorCorreo(correo.toLowerCase());
    if (!usuario) {
      const error = new Error('No se encontró ningún usuario con ese correo institucional.');
      error.status = 404;
      throw error;
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000);

    await usuarioRepository.actualizar(usuario.id, {
      tokenRecuperacion: codigo,
      token_recuperacion: codigo,
      tokenRecuperacionExpira: expira,
      token_recuperacion_expira: expira
    });

    await transporter.sendMail({
      from: `"Seguridad ClassDrop" <${process.env.EMAIL_USER}>`,
      to: usuario.correo,
      subject: 'Recuperación de contraseña - ClassDrop',
      text: `Hola ${usuario.nombreCompleto}, tu código de recuperación es: ${codigo}`, 
      html: `<p>Hola <b>${usuario.nombreCompleto}</b>,</p>
             <p>Tu código para restablecer tu contraseña es:</p>
             <h2>${codigo}</h2>`
    });

    return { success: true, mensaje: 'Código de recuperación enviado con éxito al correo.' };
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

    return { success: true, mensaje: 'Código verificado con éxito.' };
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

  async ensureAdminExists() {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail) {
      console.warn('ADMIN_EMAIL no configurado; no se verifica usuario admin.');
      return null;
    }

    const existente = await usuarioRepository.buscarPorCorreo(adminEmail);
    if (existente) {
      if (existente.rol !== 'admin') {
        await usuarioRepository.actualizar(existente.id, { rol: 'admin' });
        console.log(`Se actualizó rol a admin para ${adminEmail}`);
      } else {
        console.log(`Usuario admin ya existe: ${adminEmail}`);
      }
      return existente;
    }

    if (!adminPassword) {
      console.warn('ADMIN_PASSWORD no configurado; no se creó el usuario admin automáticamente.');
      return null;
    }

    const contrasenaHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    try {
      const nuevo = await usuarioRepository.crear({
        nombreCompleto: 'Administrador',
        correo: adminEmail,
        contrasenaHash,
        rol: 'admin',
      });
      console.log(`Usuario admin creado: ${adminEmail}`);
      return nuevo;
    } catch (err) {
      // Si falla por la constraint CHECK de correo, intentamos actualizar la constraint
      const constraintName = err.constraint || '';
      if (constraintName.includes('usuarios_correo_check') || /correo_check/i.test(err.message || '')) {
        try {
          const escaped = db.sequelize.escape(adminEmail);
          const sql = `ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_correo_check; ALTER TABLE usuarios ADD CONSTRAINT usuarios_correo_check CHECK (correo LIKE '%@ids.upchiapas.edu.mx' OR correo LIKE '%@upchiapas.edu.mx' OR correo = ${escaped});`;
          await db.sequelize.query(sql);
          console.log('Constraint usuarios_correo_check actualizada para permitir ADMIN_EMAIL.');

          const nuevo2 = await usuarioRepository.crear({
            nombreCompleto: 'Administrador',
            correo: adminEmail,
            contrasenaHash,
            rol: 'admin',
          });
          console.log(`Usuario admin creado después de actualizar constraint: ${adminEmail}`);
          return nuevo2;
        } catch (err2) {
          console.error('Error al actualizar constraint o crear admin:', err2.message || err2);
          throw err2;
        }
      }

      throw err;
    }
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