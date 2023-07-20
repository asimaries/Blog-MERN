import { PrismaPromise } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token has expired' });
  }
  next()
};

async function commitToDB(promise: PrismaPromise<any>) {
  const [error, data] = await promise
    .then(data => [null, data])
    .catch(error => [error, null])
  if (error) {
    console.log(error.message)
    return error.message
  }
  return data
}

export { errorHandler, commitToDB };
