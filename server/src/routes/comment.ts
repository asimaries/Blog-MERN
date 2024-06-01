import { auth } from "../middleware/auth"
import { createComment, deleteComment, editComment, toggleCommentLike } from "../controllers/comments"
import { Router } from "express"
const router = Router()

router.post('/:id', auth, createComment)

router.patch('/:blogId/:commentId', auth, editComment)


router.delete('/:blogId/:commentId', auth, deleteComment)

router.post('/:blogId/:commentId/toggleLike', auth, toggleCommentLike)



export default router