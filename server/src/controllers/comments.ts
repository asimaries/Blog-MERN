import { PrismaClient, PrismaPromise } from "@prisma/client"
import { Router, Request, Response } from "express"
const { commentLike: Like, comment } = new PrismaClient({})

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true
    }
  }
}


async function createComment(req: Request, res: Response) {
  try {
    if (req.body?.message === '' || req.body?.message == null)
      throw new Error("Message is required")


    return res.json(await commitToDB(comment.create({
      data: {
        message: req.body.message,
        userId: req.user!.id,
        parentId: req.body.parentId,
        blogId: req.params.id
      },
      select: COMMENT_SELECT_FIELDS
    })).then((comment: any) => {
      return {
        ...comment,
        commentLikeCount: 0,
        commentLikedByMe: false
      }
    }))

  }
  catch (error: any) {
    // console.log(error)
    return res.status(404).send(error.message)
  }
}

async function editComment(req: Request, res: Response) {
  // console.log('here at put')
  try {
    console.log(req.body.message)
    if (req.body?.message === '' || req.body?.message == null)
      throw new Error("Message is required", { cause: { code: 422 } })

    const { userId } = await commitToDB(comment.findUnique({
      where: { id: req.params.commentId },
      select: { userId: true }
    }))
    // console.log(userId, req.user!.id)
    if (userId !== req.user!.id)
      throw new Error("Unauthorized", { cause: { code: 403 } })

    return res.json(await commitToDB(comment.update({
      where: { id: req.params.commentId },
      data: { message: req.body.message },
      select: { message: true }
    })))

  }
  catch (error: any) {
    // console.log(error)
    return res.status(error.cause.code).send(error.message)
  }
}
async function deleteComment(req: Request, res: Response) {
  try {
    const { userId } = await commitToDB(comment.findUnique({
      where: { id: req.params.commentId },
      select: { userId: true }
    }))

    if (userId !== req.user!.id)
      throw new Error("Unauthorized", { cause: { code: 403 } })

    return res.json(await commitToDB(comment.delete({
      where: { id: req.params.commentId },
      select: { id: true }
    })))

  }
  catch (error: any) {
    // console.log(error)
    return res.status(error.cause.code).send(error.message)
  }
}
async function toggleCommentLike(req: Request, res: Response) {
  try {
    const data = {
      commentId: req.params.commentId,
      userId: req.user!.id
    }
    const like = await Like.findUnique({
      where: {
        userId_commentId: data,
      }
    })
    if (like == null) {
      return res.json(await commitToDB(Like.create({ data }))
        .then(() => {
          return { addLike: true }
        }))
    } else {
      return res.json(await commitToDB(Like.delete({
        where: { userId_commentId: data }
      })).then(() => {
        return { addLike: false }
      }))

    }
  }
  catch (error: any) {
    // console.log(error)
    return res.status(error.cause.code).send(error.message)
  }
}

async function commitToDB(promise: PrismaPromise<any>) {
  const [error, data] = await promise
    .then(data => [null, data])
    .catch(error => [error, null])
  if (error) {
    console.log(error.message)
    return error.message
  }
  return data
}


export { createComment, deleteComment, editComment, toggleCommentLike }