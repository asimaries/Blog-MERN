import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cookieParser from "cookie-parser";
config()

import AuthRouter from './routes/auth';
import UserRouter from './routes/user';
import PostRouter from './routes/post';
import { resolve } from 'path';


const app: Application = express();
const PORT = 7000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(resolve('./public')));

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(`>> ${req.method} ${req.path}`)
  next()
})

// routers
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);
app.use('/post', PostRouter);


app.get('/', (req, res) => {
  return res.send('Hello from /')
})


// Databases
connect('mongodb://127.0.0.1:27017/blog-mern')
  .then(() => {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
  })
  .catch(error => console.log(error.message))