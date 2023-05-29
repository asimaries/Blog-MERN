import { Request, Response } from "express";
import { validateToken } from "../services/auth";
import User from "../models/user";


function handleGetProfile(req: Request, res: Response) {
  const { token } = req.cookies;
  try {
    const user = validateToken(token)
    res.json(user)
    return res.end();
  } catch (error) {
    throw error;
  }
}
async function handleGetUserProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ account: id.toString() },{name: 1, account: 1, avatar:1, role: 1, _id:0})
    return res.json(user).end();
  } catch (error) {
    throw error;
  }
}

export { handleGetProfile, handleGetUserProfile };