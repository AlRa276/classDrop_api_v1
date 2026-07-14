// Cliente para Google Analytics 4 vía Measurement Protocol — variante de
// FLUJO DE APP DE FIREBASE (no flujo Web). Tu app "classdrop" está registrada
// en Firebase como app Android, así que el endpoint usa firebase_app_id (no
// measurement_id) y app_instance_id (no client_id).
//
// Como la app Android ya está en producción con un APK fijo y no se puede
// modificar, medimos las interacciones de negocio desde el backend en vez
// del SDK client-side. Usa el fetch global de Node, sin dependencias nuevas.
//
// NUNCA lanza una excepción hacia arriba ni bloquea la acción real del
// usuario: si GA no está configurado o falla, simplemente se omite el evento.

const crypto = require('crypto');

const GA_FIREBASE_APP_ID = process.env.GA_FIREBASE_APP_ID; // ej. 1:956492054525:android:72ccb1f27d85eca904e394
const GA_API_SECRET = process.env.GA_API_SECRET;
const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const TIMEOUT_MS = 5000;

class AnalyticsService {
  /**
   * @param {string} usuarioId    - se convierte en un app_instance_id estable (ver _idInstancia)
   * @param {string} nombreEvento - nombre del evento GA4, ej. "subir_archivo"
   * @param {object} params       - parámetros adicionales del evento
   */
  async registrarEvento({ usuarioId, nombreEvento, params = {} }) {
    if (!GA_FIREBASE_APP_ID || !GA_API_SECRET) {
      console.warn(`Analytics no configurado: se omitió el evento "${nombreEvento}"`);
      return;
    }

    if (!usuarioId) {
      console.warn(`registrarEvento("${nombreEvento}") llamado sin usuarioId; se omite`);
      return;
    }

    const controlador = new AbortController();
    const timeoutId = setTimeout(() => controlador.abort(), TIMEOUT_MS);

    try {
      await fetch(
        `${GA_ENDPOINT}?firebase_app_id=${encodeURIComponent(GA_FIREBASE_APP_ID)}&api_secret=${GA_API_SECRET}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            app_instance_id: this._idInstancia(usuarioId),
            events: [
              {
                name: nombreEvento,
                params: {
                  ...params,
                  engagement_time_msec: 1,
                },
              },
            ],
          }),
          signal: controlador.signal,
        }
      );
    } catch (err) {
      console.error(`Error enviando evento de Analytics "${nombreEvento}":`, err.message);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // GA4 espera un app_instance_id de 32 caracteres hexadecimales (el formato
  // que genera el SDK de Firebase). Como no tenemos el SDK, generamos uno
  // ESTABLE por usuario (siempre el mismo para el mismo usuarioId) con MD5,
  // para que GA pueda agrupar los eventos de la misma persona igual que
  // haría con un client_id real.
  _idInstancia(usuarioId) {
    return crypto.createHash('md5').update(String(usuarioId)).digest('hex');
  }
}

module.exports = new AnalyticsService();