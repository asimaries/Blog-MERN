import { Router } from "express";

import { handleGetProfile, handleGetUserProfile } from "../controllers/user"
const router = Router();

router.get('/profile', handleGetProfile)
router.get('/profile/:id', handleGetUserProfile)

export default router;