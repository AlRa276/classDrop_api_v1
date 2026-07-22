const comentarioRepository = require('../repositories/comentario.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const archivoRepository = require('../repositories/archivo.repository');
const analyticsService = require('./analytics.service');

const PALABRAS_PROHIBIDAS = [
  // Insultos generales
  'pendejo', 'pendeja', 'pendejos', 'pendejas',
  'idiota', 'idiotas',
  'imbecil', 'imbécil', 'imbeciles', 'imbéciles',
  'estupido', 'estúpido', 'estupida', 'estúpida',
  'tarado', 'tarada', 'tarados', 'taradas',
  'baboso', 'babosa',
  'babas',
  'cabron', 'cabrón', 'cabrona', 'cabrones', 'cabrona',
  'culero', 'culera', 'culeros', 'culeras',
  'mierda',
  'pinche', 'pinches',
  'mamon', 'mamón', 'mamona', 'mamones', 'mamonas',
  'puñetas', 'punetas',
  'inutil', 'inútil',
  'animal',
  'cretino', 'cretina',

  // México
  'chinga', 'chingado', 'chingada', 'chingados', 'chingadas',
  'chingar', 'chingas', 'chingan', 'chingue', 'chinguen',
  'chingon', 'chingón', 'chingona', 'chingones', 'chingonas',
  'chingadera', 'chingaderas',
  'chingatumadre', 'chingaatu', 'chingatu', 'chingasatumadre',
  'vetealachingada',
  'hijodelachingada',
  'hijodeputa', 'hijadeputa',
  'valeverga', 'valeverga',
  'mevaleverga',
  'alaverga',
  'averga',
  'verga', 'vergas',
  'vergazo', 'vergazos',
  'vergiza',
  'verguear', 'vergueado',
  'putazo', 'putazos',
  'putiza',
  'culo', 'culos',
  'culon', 'culón',
  'culo roto',
  'hocicon', 'hocicón',
  'hocicona',
  'naco', 'naca', 'nacos', 'nacas',
  'prieto', 'prieta',
  'menso', 'mensa',
  'wey', 'wey', 'güey', 'guey', 'weyes', 'weyes',
  'no mames', 'nomames', 'nmms',
  'mamadas', 'mamada',
  'mamonazo',
  'vale madres',
  'valemadres',

  // Sexuales y vulgares
  'puta', 'puto', 'putos', 'putas',
  'putito', 'putita',
  'prostituta',
  'zorra',
  'perra',
  'perro',
  'culo',
  'culo roto',
  'ano', 'ano', 'ano',
  'pito',
  'pene',
  'verga',
  'polla',
  'pilin',
  'penecito',
  'vagina',
  'vulva',
  'concha',
  'coño', 'cono',
  'chocha',
  'cuca',
  'tetas',
  'tetas',
  'chichis',
  'pezon',
  'pezón',

  // Acciones sexuales vulgares
  'coger',
  'cogerme',
  'cogerte',
  'cogersela',
  'cogiendo',
  'cogida',
  'cogidon',
  'follar',
  'follar',
  'follando',
  'fornicar',
  'masturbar',
  'masturbacion',
  'masturbación',
  'mamada',
  'mamamela',
  'chuparla',

  // Variantes ofensivas
  'joder',
  'jodete',
  'jódete',
  'jodan',
  'carajo',
  'cojudo',
  'cojuda',
  'gilipollas',
  'gilipollas',
  'capullo',

  // Homofóbicos (usados como insulto)
  'maricon', 'maricón',
  'marica',
  'joto',
  'jotito',
  'puñal',
  'loca',

  // Racistas o despectivos comunes
  'indio',
  'prieto',
  'negro',
  'mongol',
  'retrasado',
  'subnormal',

  // Spam
  'gratis dinero',
  'haz clic aqui',
  'haz clic aquí',
  'click aqui',
  'click aquí',
  'gana dinero',
  'apuesta',
  'casino',
  'bitcoin gratis',
  'viagra',
  'xxx',
  'porno',
  'pornografia',
  'pornografía',
  'sexcam',
  'onlyfans',
  'escort'
];
const PATRON_SPAM = /(http:\/\/|https:\/\/|www\.)/i;

class ComentarioService {
  async crearComentario({ usuarioId, archivoId, contenido }) {
    if (!contenido || !usuarioId || !archivoId) {
      const error = new Error('Faltan datos para crear el comentario');
      error.status = 400;
      throw error;
    }

    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario || !usuario.activo) {
      const error = new Error('Usuario inválido o inactivo');
      error.status = 403;
      throw error;
    }

    const archivo = await archivoRepository.buscarPorId(archivoId);
    if (!archivo || archivo.estado !== 'publicado') {
      const error = new Error('No se puede comentar un archivo no publicado');
      error.status = 400;
      throw error;
    }

    const tieneSpam = PATRON_SPAM.test(contenido);
    const tieneProhibida = PALABRAS_PROHIBIDAS.some((palabra) =>
      contenido.toLowerCase().includes(palabra)
    );

    if (tieneSpam || tieneProhibida) {
      const error = new Error('El comentario contiene contenido prohibido o spam');
      error.status = 422;
      throw error;
    }

    const comentario = await comentarioRepository.crear({ usuarioId, archivoId, contenido });

    analyticsService.registrarEvento({
      usuarioId,
      nombreEvento: 'comentar_archivo',
      params: { archivo_id: archivoId },
    });

    return comentario;
  }

  async listarPorArchivo(archivoId, usuarioId) {
    return await comentarioRepository.listarPorArchivo(archivoId, usuarioId);
  }

  async eliminarComentario(usuarioId, comentarioId) {
    const comentario = await comentarioRepository.buscarPorId(comentarioId);
    if (!comentario) {
      const error = new Error('Comentario no encontrado');
      error.status = 404;
      throw error;
    }

    if (comentario.usuarioId !== usuarioId) {
      const error = new Error('No tienes permiso para eliminar este comentario');
      error.status = 403;
      throw error;
    }

    return await comentarioRepository.marcarEliminado(comentarioId);
  }
}

module.exports = new ComentarioService();