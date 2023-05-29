import { Router } from "express";

import { createPost } from "../controllers/post";
import multer from "multer";
import { storageForPost } from "../services/uploadfile";

const router: Router = Router()
const upload = multer({ storage: storageForPost })
router.post('/create', upload.single('file'), createPost)

export default router