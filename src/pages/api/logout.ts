import { withSessionRoute } from '@/lib/auth/witSession';

export default withSessionRoute(logout);

async function logout(req: any, res: any, session: any) {
  req.session.destroy();
  res.send({ ok: true });
}
