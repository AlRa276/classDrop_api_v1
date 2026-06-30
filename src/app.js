const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const cuatrimestresRoutes = require('./routes/cuatrimestres.routes');
const materiasRoutes = require('./routes/materias.routes');
const archivosRoutes = require('./routes/archivos.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const likesArchivoRoutes = require('./routes/likes-archivo.routes');
const likesComentarioRoutes = require('./routes/likesComentario.routes');
const descargasArchivoRoutes = require('./routes/descargasArchivo.routes');
const guardadosArchivoRoutes = require('./routes/guardadosArchivo.routes');
const reporteRoutes = require('./routes/reporte.routes');
const moderacionIaRoutes = require('./routes/moderacionIa.routes');
const normasRoutes = require('./routes/normas.routes');
const politicasRoutes = require('./routes/politica.routes');
const etapasPublicacionRoutes = require('./routes/etapaPublicacion.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API ClassDrop funcionando 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cuatrimestres', cuatrimestresRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/likes-archivo', likesArchivoRoutes);
app.use('/api/likes-comentario', likesComentarioRoutes);
app.use('/api/descargas-archivo', descargasArchivoRoutes);
app.use('/api/guardados-archivo', guardadosArchivoRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/moderacion-ia', moderacionIaRoutes);
app.use('/api/normas', normasRoutes);
app.use('/api/politicas', politicasRoutes);
app.use('/api/etapas-publicacion', etapasPublicacionRoutes);
// El errorHandler SIEMPRE va después de las rutas
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});