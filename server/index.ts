import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app: Application = express();
const PORT = 7000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.path)
  next()
})


app.post('/signup', (req: Request, res: Response) => {
  const obj = { ...req.body }
  return res.json({ requestData: obj, 'formserver': 'yes' });
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
