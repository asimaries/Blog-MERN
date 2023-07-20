import { Router } from "express";
import multer from "multer";

import { createBlog, editBlog, getBlog, getAllBlog, getAllBlogOfUser, deleteBlog } from "../controllers/blog";
import { storageForBlog } from "../services/uploadfile";
import { auth } from "../middleware/auth"

const router: Router = Router()
const upload = multer({ storage: storageForBlog })


router.post('/create', [auth, upload.single('file')], createBlog)
router.get('/allBlog', getAllBlog)
router.get('/allBlog/:id', getAllBlogOfUser)

router.patch('/:id/edit', [auth, upload.single('file')], editBlog)
router.get('/:id', getBlog)
router.delete('/:id', auth, deleteBlog)
// router.post('/like/:blogId', auth, likeBlog)
// router.post('/unlike/:blogId', auth, unlikeBlog)

export default router