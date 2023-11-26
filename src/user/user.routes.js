// src/user/user.routes.js
const { Router } = require("express");
const { createUser, readUser, updateUser, deleteUser } = require("./user.controller");
const router = Router();

// Crear usuario
router.post('/', createUser);

// Buscar usuario por email y password
router.post('/credentials', readUser);

// Actualizar info de usuario
router.patch('/:userId', updateUser);

// Inhabilitar usuario
router.delete('/:userId', deleteUser);



module.exports = router;
