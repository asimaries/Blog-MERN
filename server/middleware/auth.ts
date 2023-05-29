import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // const is
  } catch (error) {
    console.log(error)
  }
}