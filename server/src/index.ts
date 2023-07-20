import { resolve } from 'path';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cookieParser from "cookie-parser";
config()

import AuthRouter from './routes/auth';
import UserRouter from './routes/user';
import BlogRouter from './routes/blog';
import { errorHandler } from './middleware/helper';
import bodyParser from 'body-parser';


const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors({ origin: process.env.BASE_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(resolve('./public')));
app.use(errorHandler)

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(`>> ${req.method} ${req.path}`)
  next()
})

// routers
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);
app.use('/blog', BlogRouter);


app.get('/', (req, res) => {
  return res.send('Hello from /')
})



// Databases
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
// connect(process.env.MONGODB_URL as string)
//   .then(() => {
//   })
//   .catch(error => console.log(error.message))