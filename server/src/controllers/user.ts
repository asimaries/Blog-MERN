import { Request, Response } from "express";
// import User from "../models/user";
import { PrismaClient } from "@prisma/client";
const { user: User } = new PrismaClient()
import { User as IUser } from "./blog";

function handleGetProfile(req: Request, res: Response) {
  try {
    const user = req.user as IUser
    return res.json(user)
  } catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: error.message }).send("Internal server error ")

    return res.status(error.cause.code).json({ message: error.message })
  }
}

async function handleGetUserProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findUniqueOrThrow({
      where: { account: id },
      select: { name: true, account: true, avatar: true }
    })
    return res.json(user);
  } catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: error.message }).send("Internal server error ")

    return res.status(error.cause.code).json({ message: error.message })
  }
}

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.findMany({
      select: {
        account: true,
        name: true,
        avatar: true,
      }
    });
    return res.json(users);
  } catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: error.message }).send("Internal server error ")

    return res.status(error.cause.code).json({ message: error.message })
  }
}

export { handleGetProfile, handleGetUserProfile, getAllUsers };