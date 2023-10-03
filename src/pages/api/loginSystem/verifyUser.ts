import connectDB from '@/models/mongoConnection';
import User from '@/models/mongoSchemas/userSchema';
import bycrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  let response = null;

  bycrypt.hash(req.body.password, 10, async function (err, hash) {
    const user = await User.findOne({
      correo: req.body.mail,
      password: hash,
    });

    if (user) {
      response = user;
    } else {
      response = null;
    }
  });

  console.log(response);

  res.status(200).json({});
}
