// ===========================
// Respuestas exitosas
// ===========================

function ok(res, data, meta = null, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    meta,
    error: null,
  });
}

function created(res, data) {
  return ok(res, data, null, 201);
}

function noContent(res) {
  return res.status(204).send();
}

// ===========================
// Respuestas de error
// ===========================

function error(res, status, code, message, details) {
  return res.status(status).json({
    success: false,
    data: null,
    meta: null,
    error: { code: String(code), message, details: details ?? null },
  });
}

function badRequest(res, details, message = 'BAD_REQUEST') {
  return error(res, 400, '400', message, details);
}

function unauthorized(res, message = 'UNAUTHORIZED') {
  return error(res, 401, '401', message, [
    { issue: 'Se requiere autenticación para acceder a este recurso.' },
  ]);
}

function forbidden(res, message = 'FORBIDDEN') {
  return error(res, 403, '403', message, [
    { issue: 'No tienes permiso para realizar esta acción.' },
  ]);
}

function notFound(res, field, issue) {
  return error(res, 404, '404', 'NOT_FOUND', [{ field, issue }]);
}

function conflict(res, field, issue) {
  return error(res, 409, '409', 'CONFLICT', [{ field, issue }]);
}

function unprocessable(res, details) {
  return error(res, 422, '422', 'UNPROCESSABLE_ENTITY', details);
}

function serverError(res, message = 'INTERNAL_SERVER_ERROR') {
  return error(res, 500, '500', message);
}

module.exports = {
  ok,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
  serverError,
};