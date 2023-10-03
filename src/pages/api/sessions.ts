import { withSessionRoute } from '@/lib/auth/witSession';
import type { NextApiResponse } from 'next';

const VALID_EMAIL = 'test@gmail.com';
const VALID_PASSWORD = 'password';

export default withSessionRoute(createSessionRoute);

async function createSessionRoute(req: any, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { mail, password } = req.body;

    if (mail === VALID_EMAIL && password === VALID_PASSWORD) {
      req.session.user = {
        username: 'test@gmail.com',
        isAdmin: true,
      };

      await req.session.save();

      res.send({ ok: true });
    }
    return res.status(403).send('');
  }
  return res.status(404).send('');
}
