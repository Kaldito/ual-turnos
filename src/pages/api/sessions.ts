import { withSessionRoute } from '@/lib/auth/witSession';
import connectDB from '@/models/mongoConnection';
import User from '@/models/mongoSchemas/userSchema';
import bcrypt from 'bcrypt';
import type { NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   mail: 'correo@electronico',
//   password: 'contraseña'
// }

export default withSessionRoute(createSessionRoute);

async function createSessionRoute(req: any, res: NextApiResponse) {
  // - Conectamos a la base de datos
  await connectDB();

  // - Si el método de la petición es POST, se procede a validar los datos
  if (req.method === 'POST') {
    let response = null;

    // - Se busca el usuario en la base de datos
    const user = await User.findOne({
      correo: req.body.mail,
    });

    if (user.status == 'inactive') return res.status(401).send('');

    // - Si el usuario existe, se procede a comparar la contraseña
    if (user) {
      await bcrypt
        .compare(req.body.password, user.password)
        .then(function (result) {
          if (result) {
            response = user;
          } else {
            response = null;
          }
        });
    }

    // - Si el usuario existe y la contraseña es correcta, se crea la sesión
    if (response) {
      req.session.user = response;

      await req.session.save();

      res.send({ ok: true });
    }

    return res.status(403).send('');
  }
  return res.status(404).send('');
}
