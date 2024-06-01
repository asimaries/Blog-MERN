import { Request, Response, NextFunction } from 'express'
import JWT, { Secret } from 'jsonwebtoken';
import { User } from '../controllers/blog';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['authorization'] as string;
  token = token?.split(' ')[1]
  if (!token)
    return res.status(401).json({ error: 'please SignIn' });

  try {
    JWT.verify(token, process.env.ACCESS_TOKEN as Secret, async (error: any, user: any) => {
      console.log(user)
      if (user) { req.user = user as User; return next() }

      if (error?.message === 'jwt expired')
        return res.json({ success: false, message: 'Access token expired' })

      console.log(error)

      return res.status(403).json({ error, message: 'User not Authenticated' })
    });
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export function authCheck(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['authorization'] as string;
  token = token?.split(' ')[1]
  // console.log(token)
  if (!token)
    return next()

  try {
    JWT.verify(token, process.env.ACCESS_TOKEN as Secret, async (error: any, user: any) => {
      console.log(user)
      if (user) { req.user = user as User; return next() }
    });
  } catch (error) {
    console.log(error)
    next(error)
  }
}