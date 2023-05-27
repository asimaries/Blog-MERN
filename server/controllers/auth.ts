import { Request, Response } from "express";

import User from '../models/user';
import { validateToken } from "../services/auth";


async function handleSignUp(req: Request, res: Response) {
  const { name, email, password } = req.body;
  
  try {
    const userDoc = await User.create({ name, email, password });
    console.log(userDoc)
    return res.status(200).json({message: "Registeration Successfull"});
  } catch (error: any) {
    console.log(error.message)
    if (error.code == 11000) {
      return res.status(400).json({ error: 'User already exits' });
    }
  }
}

async function handleSignIn(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password)
    res.locals.user = validateToken(token);
    res.status(200).cookie('token', token);
    return res.end();
  } catch (error) {
    return res.status(400).json({ error: 'incorrect emal or password' })
  }
}

export { handleSignIn, handleSignUp };