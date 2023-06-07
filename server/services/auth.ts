import JWT, { SignOptions } from "jsonwebtoken"
import { IUser } from "../models/user";

const SECRET_KEY: JWT.Secret = process.env.ACCESS_TOKEN as string;

function createPayload(user: IUser): any {

  const payload = {
    _id: user._id,
    account: user.account,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  }
  return payload;
}

function createToken(user: IUser): any {
  user = createPayload(user)
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  return { accessToken, refreshToken };
}

function validateAccessToken(token: string) {
  return JWT.verify(token, process.env.ACCESS_TOKEN, async (error, user) => {

    if (user) return user;

    if (error?.message === 'jwt expired')
      return { success: false, message: 'Access token expired' }

    console.log(error)

    return { error, message: 'User not Authenticated' }
  });
}

function validateRefreshToken(token: string) {
  return JWT.verify(token, process.env.REFRESH_TOKEN);
}

function generateAccessToken(user: IUser): any {
  const payload = createPayload(user)
  return JWT.sign(payload, `${process.env.ACCESS_TOKEN}`, { expiresIn: '10s' })
}

function generateRefreshToken(user: IUser): any {
  const payload = createPayload(user)
  return JWT.sign(payload, `${process.env.REFRESH_TOKEN}`, { expiresIn: '1m' })
}


export {
  createToken,
  validateAccessToken,
  validateRefreshToken,
  generateAccessToken,
  generateRefreshToken
};