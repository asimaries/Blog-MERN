import { Request, Response, NextFunction } from 'express'
import JWT from 'jsonwebtoken';
import { User } from '../controllers/post';

export async function auth(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['authorization'] as string;
  token = token?.split(' ')[1]
  if (!token)
    return res.status(401).json({ error: 'please SignIn' });

  try {
    JWT.verify(token, process.env.ACCESS_TOKEN, async (error: any, user: any) => {

      if (user) { req.user = user; return next() }

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