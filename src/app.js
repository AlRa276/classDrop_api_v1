const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const cuatrimestresRoutes = require('./routes/cuatrimestres.routes');
const materiasRoutes = require('./routes/materias.routes');
const archivosRoutes = require('./routes/archivos.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const likesArchivoRoutes = require('./routes/likes-archivo.routes');
const dislikesArchivoRoutes = require('./routes/dislikeArchivo.routes');
const likesComentarioRoutes = require('./routes/likesComentario.routes');
const dislikesComentarioRoutes = require('./routes/dislikesComentatios.routes');
const descargasArchivoRoutes = require('./routes/descargasArchivo.routes');
const guardadosArchivoRoutes = require('./routes/guardadosArchivo.routes');
const reporteRoutes = require('./routes/reporte.routes');
const moderacionIaRoutes = require('./routes/moderacionIa.routes');
const normasRoutes = require('./routes/normas.routes');
const politicasRoutes = require('./routes/politica.routes');
const etapasPublicacionRoutes = require('./routes/etapaPublicacion.routes');
const notificacionesRoutes = require('./routes/notificaciones.routes');
const debugRoutes = require('./routes/debug.routes');
const errorHandler = require('./middlewares/errorHandler');
const authService = require('./services/auth.service');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API ClassDrop funcionando 🚀' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cuatrimestres', cuatrimestresRoutes);
app.use('/api/v1/materias', materiasRoutes);
app.use('/api/v1/archivos', archivosRoutes);
app.use('/api/v1/comentarios', comentariosRoutes);
app.use('/api/v1/likes/archivos', likesArchivoRoutes);
app.use('/api/v1/dislikes/archivos', dislikesArchivoRoutes);
app.use('/api/v1/likes/comentarios', likesComentarioRoutes);
app.use('/api/v1/dislikes/comentarios', dislikesComentarioRoutes);
app.use('/api/v1/descargas', descargasArchivoRoutes);
app.use('/api/v1/guardados', guardadosArchivoRoutes);
app.use('/api/v1/reportes', reporteRoutes);
app.use('/api/v1/moderaciones', moderacionIaRoutes);
app.use('/api/v1/normas', normasRoutes);
app.use('/api/v1/politicas', politicasRoutes);
app.use('/api/v1/etapas', etapasPublicacionRoutes);//etapas de publicacion de archivos
app.use('/api/v1/notificaciones', notificacionesRoutes);
app.use('/api/v1/debug', debugRoutes);
// El errorHandler SIEMPRE va después de las rutas
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await authService.ensureAdminExists();
  } catch (err) {
    console.error('Error al asegurar existencia de admin:', err.message || err);
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
})();