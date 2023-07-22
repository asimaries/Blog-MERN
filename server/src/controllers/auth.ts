import { Request, Response } from "express";
import JWT, { Secret } from "jsonwebtoken";

// import User from '../models/user';
import { createToken, generateAccessToken, getGoogleOAuthToken, validateAccessToken } from "../services/auth";
import { sendMail } from "../services/mailer";
import { generateVerificationToken } from "../services/generateToken";
import { validEmail, validPhone } from "../middleware/validator";
// import verifyModel from "../models/verify";
import { sendSMS } from "../services/sendSMS";


import { PrismaClient } from '@prisma/client'
import { randomBytes, createHmac } from "crypto";
// import verifyModel from "models/verify";
// const prisma = new PrismaClient({ log: ['query'] })
const { user: User, verification: Verification } = new PrismaClient()

type UserRequestPayload = { name?: string, account: string, password: string };
/**
 * Handle SignUp
 */
async function handleSignUp(req: Request, res: Response) {
  const { name, account, password } = req.body satisfies UserRequestPayload;

  try {
    let user = await User.findUnique({
      where: {
        account
      }, select: {
        id: true,
        verified: true
      }
    })
    if (user) {
      if (user.verified)
        throw new Error("User already exists with the provided account details", { cause: { code: 409 } })
      throw new Error('Please verify your account', { cause: { code: 401 } })
    }
    const salt = randomBytes(16).toString();
    const hashPassword = createHmac('sha256', salt)
      .update(password)
      .digest('hex')
    user = await User.create({
      data: {
        name,
        account,
        salt,
        password: hashPassword,
      }
    });

    const token = generateVerificationToken(account);
    await Verification.create({ data: { token, user: { connect: { id: user.id } } } })

    if (validEmail(account)) sendMail([account], token)
    if (validPhone(account)) sendSMS(account, token)

    return res.status(200).json({ message: "Verification link has been sent to your provied Email/Phoneno" });
  } catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: error.message }).send("Internal server error ")

    return res.status(error.cause.code).json({ message: error.message })
  }
}

async function matchPasswordAndgenerateVerificationToken({ account, password }: UserRequestPayload): Promise<any> {

  const user = await User.findUnique({
    where: { account },
    // select: { verified: true, password: true, salt: true }
  });

  if (!user)
    throw new Error('User not Found', { cause: { code: 404 } })

  if (!user.verified)
    throw new Error('Please verify your email', { cause: { code: 401 } })

  const hashPassword = createHmac('sha256', user.salt)
    .update(password)
    .digest('hex')
  if (hashPassword !== user.password)
    throw new Error('Wrong Password', { cause: { code: 401 } })

  // console.log(user)
  return createToken(user);
}

async function handleSignIn(req: Request, res: Response) {
  const { account, password } = req.body satisfies UserRequestPayload;
  try {
    const { accessToken, refreshToken }: any = await matchPasswordAndgenerateVerificationToken({ account, password })
    const user = await validateAccessToken(accessToken)
    refreshTokens.add(refreshToken)
    return res.status(200)
      .cookie('token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 1 days
      })
      .json({ user, accessToken });

  } catch (error: any) {
    // console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: "Internal server error ", cause: error.message })

    return res.status(error.cause.code).json({ message: error.message })
  }
}

let refreshTokens = new Set()

async function handleRefresh(req: Request, res: Response) {
  const { token } = req.cookies;
  try {
    if (!token) throw new Error('Unauthorized', { cause: { code: 400 } })
    // return res.status(400).json({ message: 'Unauthorized' })

    JWT.verify(token,
      process.env.REFRESH_TOKEN as Secret,
      async (err: any, user: any) => {
        console.log(err)
        if (err) throw new Error(err) //return res.status(403).json({ message: 'Forbidden' })
        console.log(user.account)
        const foundUser = await User.findUnique({
          where: {
            account: user.account
          }
        })

        if (!foundUser) throw new Error('Unauthorized', { cause: { code: 401 } }) // return res.status(401).json({ message: 'Unauthorized' })

        const accessToken = generateAccessToken(foundUser)
        return res.json({ accessToken })
      })
  }
  catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: "Internal server error ", cause: error.message })

    return res.status(error.cause.code).json({ message: error.message })
  }
}

function handleLogout(req: Request, res: Response) {
  return res.status(200).clearCookie('token').json('OK')
}

async function emailVerificaton(req: Request, res: Response) {
  const { id } = req.params
  try {
    const verifyet = await Verification.findUnique({
      where: { token: id },
      select: { id: true, userId: true }
    })
    if (verifyet == null)
      throw new Error('Invalid token please sign up', { cause: { code: 400 } })

    const user = await User.update({
      where: {
        id: verifyet?.userId
      },
      data: {
        verified: true
      }, select: {
        id: true
      }
    })

    if (user == null)
      throw new Error('Invalid token please sign up', { cause: { code: 400 } })
    return res.status(200).json({ message: 'Your account has been verified' })
  }
  catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: "Internal server error ", cause: error.message })

    return res.status(error.cause.code).json({ message: error.message })
  }
}

async function googleOAuth(req: Request, res: Response) {
  // get the code from qs
  const code = req.query.code as string
  const { } = await getGoogleOAuthToken({ code })
  // get the id and access token 

  // get user with tokens

  // upsert the user 

  // create session

  // create access and refresh token 
  // setcookies
  // redirect back to client
}


export {
  handleSignIn,
  handleSignUp,
  handleLogout,
  emailVerificaton,
  handleRefresh,
  googleOAuth
};