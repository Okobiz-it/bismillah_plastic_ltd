import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      admin?: any;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'fallback_secret_key_123456789';
      const decoded = jwt.verify(token, secret);
      req.admin = decoded;
      next();
    } catch (_error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};
