import { Router } from "express";
import multer from "multer";

import { createPost, editPost, getPost, getAllPost } from "../controllers/post";
import { storageForPost } from "../services/uploadfile";
import { auth } from "../middleware/auth"

const router: Router = Router()
const upload = multer({ storage: storageForPost })


router.post('/create', [auth, upload.single('file')], createPost)
router.get('/allPost', getAllPost)

router.patch('/:id/edit', [auth, upload.single('file')], editPost)
router.get('/:id', getPost)


export default router