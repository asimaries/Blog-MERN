import JWT, { SignOptions } from "jsonwebtoken"
import { IUser } from "../models/user";

const SECRET_KEY:JWT.Secret = process.env.SECRET_KEY as string;

function createToken(user: IUser): string {
  const payload = {
    _id: user._id,
    account: user.account,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  }
  const options: SignOptions = {
    expiresIn: "1d"
  }
  const token = JWT.sign(payload, SECRET_KEY, options)
  return token;
}

function validateToken(token: string){
  return JWT.verify(token, SECRET_KEY);
}

export { createToken, validateToken };