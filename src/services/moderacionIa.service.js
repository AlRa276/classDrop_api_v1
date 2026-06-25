const moderacionIaRepository = require('../repositories/moderacionIa.repository');

class ModeracionIaService {
  async registrarModeracion({ archivoId, motivoFlag, aprobado, revisadoPor }) {
    if (!archivoId) {
      const error = new Error('Debe indicar el archivo moderado');
      error.status = 400;
      throw error;
    }

    return await moderacionIaRepository.crear({
      archivoId,
      motivoFlag,
      aprobado,
      revisadoPor,
    });
  }

  async listarPorArchivo(archivoId) {
    return await moderacionIaRepository.listarPorArchivo(archivoId);
  }
}

module.exports = new ModeracionIaService();
