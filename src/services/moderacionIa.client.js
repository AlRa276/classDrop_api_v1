// Cliente para el microservicio de moderación (Python + FastAPI).
// Usa el fetch global de Node (disponible desde Node 18+), sin dependencias nuevas.

const MODERATION_SERVICE_URL = process.env.MODERATION_SERVICE_URL; // ej. https://tu-servicio.up.railway.app
const MODERATION_API_KEY = process.env.MODERATION_API_KEY;
const TIMEOUT_MS = 20000; // el Nivel 3 (DistilBERT) puede tardar unos segundos

class ModeracionIaClient {
  /**
   * Llama al microservicio. NUNCA lanza una excepción hacia arriba: si el
   * servicio no está configurado, no responde a tiempo, o truena, devuelve
   * un veredicto "revisar" para que el archivo quede en cola humana normal.
   * Así, un problema en el microservicio de IA jamás bloquea que alguien
   * pueda subir un archivo.
   */
  async moderarArchivo({ archivoId, titulo, descripcion, nombreArchivo, tipoMime, tamanoBytes, urlArchivo }) {
    if (!MODERATION_SERVICE_URL) {
      return this._resultadoRevisarPorDefecto(archivoId, 'MODERATION_SERVICE_URL no configurada');
    }

    const controlador = new AbortController();
    const timeoutId = setTimeout(() => controlador.abort(), TIMEOUT_MS);

    try {
      const respuesta = await fetch(`${MODERATION_SERVICE_URL}/moderar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': MODERATION_API_KEY || '',
        },
        body: JSON.stringify({
          archivo_id: archivoId,
          titulo,
          descripcion: descripcion || '',
          nombre_archivo: nombreArchivo,
          tipo_mime: tipoMime,
          tamano_bytes: tamanoBytes,
          url_archivo: urlArchivo,
        }),
        signal: controlador.signal,
      });

      if (!respuesta.ok) {
        return this._resultadoRevisarPorDefecto(archivoId, `Microservicio respondió ${respuesta.status}`);
      }

      const datos = await respuesta.json();
      return {
        veredictoFinal: datos.veredicto_final,
        puntajeRiesgo: datos.puntaje_riesgo,
        motivo: datos.motivo,
        nivelesEjecutados: datos.niveles_ejecutados,
      };
    } catch (err) {
      return this._resultadoRevisarPorDefecto(archivoId, `Error de conexión: ${err.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  _resultadoRevisarPorDefecto(archivoId, motivo) {
    return {
      veredictoFinal: 'revisar',
      puntajeRiesgo: 50,
      motivo,
      nivelesEjecutados: [],
    };
  }
}

module.exports = new ModeracionIaClient();