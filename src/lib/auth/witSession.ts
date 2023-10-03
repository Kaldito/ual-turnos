import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from './ironConfig';

export function withSessionRoute(handler: any) {
  return withIronSessionApiRoute(handler, ironOptions);
}

export function withSessionSsr(handler: any) {
  return withIronSessionSsr(handler, ironOptions);
}
