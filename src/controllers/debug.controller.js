const { ok, forbidden } = require('../utils/apiResponse');

class DebugController {
  adminEmail(req, res, next) {
    try {
      // No exponer en production
      if (process.env.NODE_ENV === 'production') {
        return forbidden(res, 'Not allowed in production');
      }

      const admin = process.env.ADMIN_EMAIL || null;
      return ok(res, { adminEmail: admin });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DebugController();
