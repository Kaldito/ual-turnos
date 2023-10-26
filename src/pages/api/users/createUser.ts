import connectDB from '@/models/mongoConnection';
import User from '@/models/mongoSchemas/userSchema';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   username: 'Nombre de usuario',
//   mail: 'correo@electronico',
//   password: 'contraseña',
//   rol: 'admin'
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { username, email, password, rol, servicePoint } = req.body;

    // - Validando que no se haya registrado el mismo correo o contraseña
    const validateMail = await User.findOne({ correo: email.toLowerCase() });
    const validateUsername = await User.findOne({ username: username });

    if (validateMail || validateUsername) {
      return res
        .status(400)
        .json({ message: 'El nombre de usuario o correo ya existen.' });
    }

    // - Encriptar la contraseña
    bcrypt.hash(password, 10, async function (err, hash) {
      const userObject: any = {
        username: username,
        correo: email.toLowerCase(),
        password: hash,
        rol: rol,
        status: 'active',
      };

      if (servicePoint != '') {
        userObject['servicePoint'] = servicePoint;
      }

      const user = new User(userObject);

      await user.save();
    });

    res.status(200).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
