import JWT, { SignOptions } from "jsonwebtoken"
import { IUser } from "../models/user";

const SECRET_KEY: JWT.Secret = process.env.ACCESS_TOKEN as string;

function createToken(user: IUser): string {
  const payload = {
    _id: user._id,
    account: user.account,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  }
  const token = generateAccessToken(payload)
  return token;
}

function validateToken(token: string) {
  return JWT.verify(token, SECRET_KEY);
}
function generateAccessToken(payload: object) {
  return JWT.sign(payload, `${process.env.ACCESS_TOKEN}`, { expiresIn: '10s' })
}

export function generateRefreshToken(payload: object) {
  return JWT.sign(payload, `${process.env.REFRESH_TOKEN}`, { expiresIn: '1m' })
}
export { createToken, validateToken };