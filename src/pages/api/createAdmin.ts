import connectDB from '@/models/mongoConnection';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  //   bcrypt.hash('123456', 10, async function (err, hash) {
  //     const admin = new userSchema({
  //       username: 'admin',
  //       correo: 'dantekaled100@gmail.com',
  //       password: hash,
  //       rol: 'admin',
  //       status: 'active',
  //     });

  //     await admin.save();
  //   });

  res.status(200).json({});
}
