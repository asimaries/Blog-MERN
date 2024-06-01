import { Router } from "express";


import {
  handleSignUp,
  handleSignIn,
  handleLogout,
  emailVerificaton,
  handleRefresh,
  googleOAuth
} from "../controllers/auth";
import { validSignUp } from "../middleware/validator";


const router = Router();

router.post('/signup', validSignUp, handleSignUp)
router.get('/verify/:id', emailVerificaton)
router.get('/google', googleOAuth)

router.post('/signin', handleSignIn)
router.post('/refresh', handleRefresh)
router.post('/logout', handleLogout)


export default router;