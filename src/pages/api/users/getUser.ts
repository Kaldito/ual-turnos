import connectDB from '@/models/mongoConnection';
import User from '@/models/mongoSchemas/userSchema';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:
// - user_id: ID del usuario que se desea obtener
// - Ejemplo: /api/users/getUser?user_id=123456

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { user_id } = req.query;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    res
      .status(200)
      .json({ message: 'Usuario obtenido correctamente', user_data: user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
