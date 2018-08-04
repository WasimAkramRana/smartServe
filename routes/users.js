var express    = require('express');
var router     = express.Router();
var usersCtrl  = require('../controllers/usersCtrl'); // require user validation controller

/**
* API routes for user validation actions
*/
router.post('/signup',             usersCtrl.signup);
router.post('/login',              usersCtrl.login);

module.exports = router; // Export user validation actions routes
