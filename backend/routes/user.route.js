const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// Rota para registro de usuário
router.post('/register', UserController.register);

// Rota para login de usuário
router.post('/login', UserController.login);

module.exports = router;
