import { config } from '../config.js';
import { userFromToken } from '../auth/sessions.js';
import { bearerToken } from './auth.js';

/* The single account named in ADMIN_USER. Nobody else can open the page. */
export function requireAdmin(req, res, next) {
  const user = userFromToken(bearerToken(req));
  if (!user) return res.status(401).json({ error: 'Please log in.' });
  if (!config.adminUser) return res.status(403).json({ error: 'Admin access is not set up.' });
  if (user.usernameLower !== config.adminUser) {
    return res.status(403).json({ error: 'This account cannot open the admin page.' });
  }
  req.user = user;
  next();
}
