import { Request, Response } from "express";

import User from '../models/user';
import { validateToken } from "../services/auth";
import { sendMail } from "../services/mailer";
import { generateVerificationToken } from "../services/generateToken";
import { validEmail, validPhone } from "../middleware/validator";
import verifyModel from "../models/verify";
import { User as IUser } from "./post";
import { sendSMS } from "../services/sendSMS";


async function handleSignUp(req: Request, res: Response) {
  const { name, account, password } = req.body;

  try {
    let user = await User.findOne({ account })
    if (user && user.verified == false)
      return res.json({ message: "Please verify your account" })

    user = await User.create({ name, account, password });
    const token = generateVerificationToken(account);
    await verifyModel.create({ id: user._id, token: token })

    if (validEmail(account)) sendMail(account, token)
    if (validPhone(account)) sendSMS(account, token)

    return res.status(200).json({ message: "Verification link has been sent to your provied Email/Phoneno" });
  } catch (error: any) {

    console.log(error.message)
    if (error.code == 11000)
      return res.status(400).json({ message: 'User already exits' });
    if (error.message) {
      return res.status(400).json({ message: error.message });

    }
    return res.status(500).json({ message: "Internal server error " });
  }
}

async function handleSignIn(req: Request, res: Response) {
  const { account, password } = req.body;
  try {
    const token = await User.matchPasswordAndgenerateVerificationToken(account, password)
    const user = validateToken(token) as IUser
    res.status(200)
      .cookie('token', token)
      .json({ user });
    return res.end();
  } catch (error: any) {
    console.log(error?.message)
    return res.status(400)
      .json({ error: error.message })
  }
}

function handleLogout(req: Request, res: Response) {
  return res.status(200).cookie('token', '').json('OK')
}

async function emailVerificaton(req: Request, res: Response) {
  const { id } = req.params
  try {
    const verifyet = await verifyModel.findOneAndDelete({ token: id })

    const user = await User.findByIdAndUpdate(verifyet?.id, { verified: true })

    if (!verifyet && !user)
      return res.status(400).json({ message: 'Invalid token please sign up' })
    return res.status(200).json({ message: 'Your account has been verified' })
  }
  catch (error) {
    console.log(error)
  }
}


export { handleSignIn, handleSignUp, handleLogout, emailVerificaton };