import { Request, Response, NextFunction } from 'express'
import { validateToken } from '../services/auth';
import { User } from '../controllers/post';
export {}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'please SignIn' });
  }
  try {
    req.user = validateToken(token) as User
    next()
  } catch (error) {
    console.log(error)
    next(error)
  }
}