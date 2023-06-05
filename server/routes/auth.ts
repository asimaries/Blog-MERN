import { Router } from "express";


import { handleSignUp, handleSignIn, handleLogout, emailVerificaton } from "../controllers/auth";
import { validSignUp } from "../middleware/validator";


const router = Router();

router.post('/signup', validSignUp, handleSignUp)
router.get('/verify/:id', emailVerificaton)

router.post('/signin', handleSignIn)
router.post('/logout', handleLogout)


export default router;