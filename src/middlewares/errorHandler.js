const { badRequest, unauthorized, forbidden, notFound, conflict, unprocessable, serverError } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  switch (err.status) {
    case 400:
      return badRequest(res, err.details, err.message);
    case 401:
      return unauthorized(res, err.message);
    case 403:
      return forbidden(res, err.message);
    case 404:
      return notFound(res, err.field || 'recurso', err.message);
    case 409:
      return conflict(res, err.field || 'recurso', err.message);
    case 422:
      return unprocessable(res, err.details || [{ issue: err.message }]);
    default:
      return serverError(res, err.message);
  }
}

module.exports = errorHandler;