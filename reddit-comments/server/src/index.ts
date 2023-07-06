import express, { Express, NextFunction, Request, Response } from "express"
import userRouter from "./router/user"
const app: Express = express()

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`)
  next()
})


app.use('/users', userRouter)
app.get(`/`, (req: Request, res: Response) => {
  return res.send('hello')
})

app.listen(8080, () => console.log(`🚀 http://127.0.0.1:8080`));
