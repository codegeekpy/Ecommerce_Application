import jwt from 'jsonwebtoken';
import { store } from '../data/dbStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_secret_jwt_key_987654321';

export function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
}

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await store.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User belonging to token no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
}
