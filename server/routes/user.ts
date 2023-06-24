import { Router } from "express";

import { handleGetProfile, handleGetUserProfile, getAllUsers } from "../controllers/user"
import { auth } from "../middleware/auth";

const router = Router();

router.get('/profile', auth, handleGetProfile)
router.get('/profile/:id', handleGetUserProfile)
router.get('/profileall', getAllUsers)

export default router;