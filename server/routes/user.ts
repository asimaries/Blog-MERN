import { Router } from "express";

import { handleGetProfile, handleGetUserProfile } from "../controllers/user"
import User from "../models/user";
const router = Router();

router.get('/profile', handleGetProfile)
router.get('/profile/:id', handleGetUserProfile)
router.get('/profileall',async  (req, res) => {
  const users = await User.find({}, {
    _id: 1,
    account: 1,
    name: 1,
    role: 1,
    avatar: 1,
  });
  return res.json(users).end();
})

export default router;