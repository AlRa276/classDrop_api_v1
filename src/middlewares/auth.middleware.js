const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Token de autenticación no proporcionado');
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    return next();
  } catch (err) {
    const error = new Error('Token inválido o expirado');
    error.status = 401;
    return next(error);
  }
}

function adminMiddleware(req, res, next) {
  if (!req.usuario) {
    const error = new Error('No autorizado');
    error.status = 401;
    return next(error);
  }

  if (req.usuario.rol !== 'admin') {
    const error = new Error('Se requiere rol de administrador');
    error.status = 403;
    return next(error);
  }

  return next();
}

module.exports = {
  authMiddleware,
  adminMiddleware,
};
