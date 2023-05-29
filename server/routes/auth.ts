import { Router } from "express";


import { handleSignUp, handleSignIn, handleLogout } from "../controllers/auth";


const router = Router();

router.post('/signup', handleSignUp)
router.post('/signin', handleSignIn)
router.post('/logout', handleLogout)


export default router;