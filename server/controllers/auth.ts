import { Request, Response } from "express";

import User from '../models/user';
import { validateToken } from "../services/auth";


async function handleSignUp(req: Request, res: Response) {
  const { name, account, password } = req.body;

  try {
    const userDoc = await User.create({ name, account, password });
    // console.log(userDoc)
    return res.status(200).json({ message: "Registeration Successfull" });
  } catch (error: any) {
    console.log(error.message)
    if (error.code == 11000) {
      return res.status(400).json({ error: 'User already exits' });
    }
    return res.status(500).json({ error: error.message });
  }
}

async function handleSignIn(req: Request, res: Response) {
  const { account, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(account, password)
    const user = validateToken(token)
    res.status(200).cookie('token', token).json({ user });
    return res.end();
  } catch (error) {
    return res.status(400).json({ error: 'incorrect emal or password' })
  }
}

function handleLogout(req: Request, res: Response) {
  return res.status(200).cookie('token', '').json('OK')
}

export { handleSignIn, handleSignUp, handleLogout };