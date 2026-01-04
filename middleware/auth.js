const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Auth middleware:
// - If a Bearer token is provided, verify it and set `req.user = { id, isAnonymous: false }`.
// - Otherwise, look for `x-client-id` header or `clientId` cookie and use that as anonymous id.
// - If none present, generate a `clientId` UUID, set a cookie, and use it.
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, isAnonymous: false };
      return next();
    } catch (err) {
      // fallthrough to client-id fallback
    }
  }

  // client-id flow
  const headerClientId = req.header('x-client-id');
  const cookieClientId = req.cookies && req.cookies.clientId;
  const clientId = headerClientId || cookieClientId || uuidv4();

  // ensure the cookie is set for persistent anonymous sessions
  if (!cookieClientId) {
    res.cookie('clientId', clientId, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  }

  req.user = { id: clientId, isAnonymous: true };
  next();
};

module.exports = authMiddleware;
