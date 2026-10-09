import { userFromToken } from '../auth/sessions.js';

export function bearerToken(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}

export function requireAuth(req, res, next) {
  const user = userFromToken(bearerToken(req));
  if (!user) return res.status(401).json({ error: 'Please log in.' });
  req.user = user;
  next();
}
