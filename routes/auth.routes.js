const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.get('/login', AuthController.showLogin);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);

// Optional register route for setup
router.get('/register', AuthController.showRegister);
router.post('/register', AuthController.register);

module.exports = router;