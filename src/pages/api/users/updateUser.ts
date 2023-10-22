import connectDB from '@/models/mongoConnection';
import User from '@/models/mongoSchemas/userSchema';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición PUT con los siguientes datos:
// {
//   user_id: ID del usuario que se va a actualizar,
//   changes: Objeto con los cambios que se desean actualizar en el usuario
// }

// Ejemplo changes:
// const changes = {
//   username: "Dante Kaled",
//   correo: 'dantekaled100@gmail.com',
//   password: '1223456789'
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { user_id, changes } = req.body;

    if (changes.username) {
      const validateUsername = await User.findOne({
        username: changes.username,
        _id: { $ne: user_id },
      });

      if (validateUsername) {
        return res
          .status(400)
          .json({ message: 'El nombre de usuario ya existe' });
      }
    }

    if (changes.correo) {
      const validateEmail = await User.findOne({
        correo: changes.correo,
        _id: { $ne: user_id },
      });

      if (validateEmail) {
        return res.status(400).json({ message: 'El correo ya existe' });
      }
    }

    if (changes.password) {
      bcrypt.hash(changes.password, 10, async function (err, hash) {
        changes.password = hash;

        await User.findByIdAndUpdate(user_id, changes);

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
      });
    } else {
      await User.findByIdAndUpdate(user_id, changes);

      res.status(200).json({ message: 'Usuario actualizado correctamente' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
