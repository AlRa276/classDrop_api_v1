const express = require('express');
const router = express.Router();
const debugController = require('../controllers/debug.controller');

router.get('/admin-email', debugController.adminEmail);

module.exports = router;
