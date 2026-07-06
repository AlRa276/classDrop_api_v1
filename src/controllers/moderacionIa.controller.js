const moderacionIaService = require('../services/moderacionIa.service');
const archivoService = require('../services/archivo.service');
const usuarioRepository = require('../repositories/usuario.repository');
const { sendPushNotification } = require('../services/notificacion.service');
const { ok, created } = require('../utils/apiResponse');

class ModeracionIaController {
  async registrar(req, res, next) {
    try {
      const { archivoId, motivoFlag, aprobado } = req.body;

      // 1. Guardar la moderación en la BD
      const moderacion = await moderacionIaService.registrarModeracion({
        archivoId: archivoId,
        motivoFlag: motivoFlag,
        aprobado: aprobado,
        revisadoPor: req.usuario.id,
      });

      // 2. Enviar Notificación Push
      try {
        const archivo = await archivoService.obtenerPorId(archivoId, req.usuario.id);
        const usuarioPropietario = await usuarioRepository.buscarPorId(archivo.subidoPor);

        if (usuarioPropietario && usuarioPropietario.fcmToken) {
          const titulo = aprobado ? '✅ Archivo Aprobado' : '❌ Archivo Rechazado';
          const cuerpo = aprobado 
            ? `Tu archivo "${archivo.titulo}" ha sido aceptado y ya está público en ClassDrop.` 
            : `Tu archivo "${archivo.titulo}" fue rechazado. Motivo: ${motivoFlag}`;

          await sendPushNotification(usuarioPropietario.fcmToken, titulo, cuerpo);
        }
      } catch (notifError) {
        console.error('Error al enviar notificación push:', notifError);
      }

      return created(res, moderacion);
    } catch (err) {
      next(err);
    }
  }

  async listarPorArchivo(req, res, next) {
    try {
      const moderaciones = await moderacionIaService.listarPorArchivo(req.params.archivoId);
      return ok(res, moderaciones);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ModeracionIaController();