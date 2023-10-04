import connectDB from '@/models/mongoConnection';
import User from '@/models/mongoSchemas/userSchema';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { username, email, password, rol } = req.body;

    const validateMail = await User.findOne({ correo: email });
    const validateUsername = await User.findOne({ username: username });

    if (validateMail || validateUsername) {
      return res
        .status(400)
        .json({ message: 'El nombre de usuario o correo ya existen.' });
    }

    bcrypt.hash(password, 10, async function (err, hash) {
      const user = new User({
        username: username,
        correo: email,
        password: hash,
        rol: rol,
        status: 'active',
      });

      await user.save();
    });

    res.status(200).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
