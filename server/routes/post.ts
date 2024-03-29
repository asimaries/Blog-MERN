import { Router } from "express";
import multer from "multer";

import { createPost, editPost, getPost, getAllPost, getAllPostById, likePost, unlikePost , deletePost} from "../controllers/post";
import { storageForPost } from "../services/uploadfile";
import { auth } from "../middleware/auth"

const router: Router = Router()
const upload = multer({ storage: storageForPost })


router.post('/create', [auth, upload.single('file')], createPost)
router.get('/allPost', getAllPost)
router.get('/allPost/:id', getAllPostById)

router.patch('/:id/edit', [auth, upload.single('file')], editPost)
router.get('/:id', getPost)
router.delete('/:id', auth, deletePost)
router.post('/like/:postId', auth, likePost)
router.post('/unlike/:postId', auth, unlikePost)

export default router