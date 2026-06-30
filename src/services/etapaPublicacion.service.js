const etapaPublicacionRepository = require('../repositories/etapaPublicacion.repository');
const archivoRepository = require('../repositories/archivo.repository');
const { ETAPAS } = require('../models/etapaPublicacion.model');

const ESTADO_A_ETAPA = {
  pendiente:        'archivo_recibido',
  escaneando:       'escaneo_seguridad',
  revision_calidad: 'revision_calidad',
  publicado:        'publicacion',
  rechazado:        null,
};

class EtapaPublicacionService {
  async inicializar(archivoId) {
    return await etapaPublicacionRepository.crearEtapasIniciales(archivoId, ETAPAS);
  }

  async obtenerPorArchivo(archivoId, usuarioActual) {
    const archivo = await archivoRepository.buscarPorId(archivoId);
    if (!archivo) {
      const error = new Error('Archivo no encontrado'); error.status = 404; throw error;
    }
    const esPropietario = archivo.subidoPor === usuarioActual.id;
    const esAdmin = usuarioActual.rol === 'admin';
    if (archivo.estado !== 'publicado' && !esPropietario && !esAdmin) {
      const error = new Error('No tienes permiso para ver el estado de este archivo');
      error.status = 403; throw error;
    }
    const etapas = await etapaPublicacionRepository.listarPorArchivo(archivoId);
    return { archivoId, estadoArchivo: archivo.estado, etapas };
  }

  async avanzarEtapa(archivoId, etapa, { completado, progreso } = {}) {
    if (!ETAPAS.find(e => e.valor === etapa)) {
      const error = new Error('Etapa inválida'); error.status = 400; throw error;
    }
    const resultado = await etapaPublicacionRepository.actualizarEtapa(archivoId, etapa, {
      completado: completado ?? false,
      progreso: progreso ?? null,
    });
    if (!resultado) {
      const error = new Error('No se encontraron las etapas de este archivo');
      error.status = 404; throw error;
    }
    return resultado;
  }
}

module.exports = new EtapaPublicacionService();