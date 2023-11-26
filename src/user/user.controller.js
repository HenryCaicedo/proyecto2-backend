// src/user.controller.js
const User = require("./user.model");


// Crear Usuario
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const user = new User(userData);
        const newUser = await user.save();
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear un usuario' });
    }
};



// Obtener usuario por credenciales
const readUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password, active: true });

        if (!user) {
            res.status(404).send('Usuario no encontrado o inactivo');
        } else {
            res.status(200).send(user);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener un usuario por credenciales' });
    }
};

// Actualizar usuario por ID
const updateUser = async (req, res) => {
  try {
      const userId = req.params.userId;

      if (!userId) {
          res.status(400).send('Se requiere ID');
          return;
      }

      const user = await User.findOne({ _id: userId, active: true });

      if (!user) {
          res.status(404).send('Usuario no encontrado o inactivo');
          return;
      }

      // Update the user with the request body data
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

      res.status(200).send(updatedUser);
  } catch (error) {
      res.status(500).json({ error: 'Error al actualizar un usuario' });
  }
};


// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user || !user.active) {
            res.status(404).send('Usuario no encontrado o inactivo');
            return;
        }

        const deletedUser = await User.findByIdAndUpdate(
            userId,
            { active: false },
        );

        if (deletedUser) {
            res.status(200).json({ message: 'Usuario desactivado' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar un usuario' });
    }
};


// Mostrar a todos los usuarios
const showAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length === 0) {
            res.status(404).send('No se encontraron usuarios');
        } else {
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener todos los usuarios' });
    }
};


module.exports = { createUser, readUser, updateUser, deleteUser, showAllUsers };
