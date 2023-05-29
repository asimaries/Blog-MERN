import { Request, Response } from "express";
import { validateToken } from "../services/auth";

export interface User {
  _id: String,
  account: String,
  name: String,
  role: String,
  avatar: String,
}

async function createPost(req: Request, res: Response) {
  const { title, summary, content } = req.body;
  const file = req.file
  console.log(title, summary, content, file)
  const user = validateToken(req.cookies.token) as User
  const filepath = file?.path.split('//').join('/')
  res.json({ title, summary, content, filepath: filepath?.toString() })
  console.log(filepath)
  return res.end()
}

export { createPost }