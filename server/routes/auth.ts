import { Router } from "express";


import { handleSignUp, handleSignIn } from "../controllers/auth";


const router = Router();

router.post('/signup', handleSignUp)
router.post('/signin', handleSignIn)


export default router;