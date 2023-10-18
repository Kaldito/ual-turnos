import connectDB from '@/models/mongoConnection';
import User from '@/models/mongoSchemas/userSchema';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición PUT con los siguientes datos:
// {
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { newStatus, user_id } = req.body;

    await User.findByIdAndUpdate(user_id, { status: newStatus });

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
