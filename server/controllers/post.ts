import { Request, Response } from "express";
import { Post, IPost } from "../models/post";

export interface User {
  _id: String,
  account: String,
  name: String,
  role: String,
  avatar: String,
}

async function createPost(req: Request, res: Response) {

  const user = req.user as User
  try {
    const { title, summary, content } = req.body;
    const file = req.file
    const post = await Post.create({
      title,
      summary,
      content,
      cover: file?.path,
      createdBy: user._id
    })
    return res.json({ postID: post._id })
  } catch (error) {
    console.log(error)
  }

}

async function editPost(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user as User
  const { title, summary, content } = req.body;
  try {
    const post = await Post.findOne({ _id: id })

    if (!(post?.createdBy?._id.equals(user._id.toString())))
      return res.status(400)
        .json({ error: 'unauthorized request you cannot edit this post' })

    const file = req?.file
    let newdata: any = { title, summary, content }
    if (file) newdata = { ...newdata, cover: file.path }

    await Post.updateOne(
      { _id: post._id },
      { $set: { ...newdata } }
    );

    return res.status(200).json({ postID: post._id })
  }
  catch (error) {
    return res.status(500)
      .json({ error: 'Internal server error ' })
  }
}

async function getPost(req: Request, res: Response) {
  const { id } = req.params;
  try {
    let post = await Post
      .findOne({ _id: id })
      .populate('createdBy', 'account createdAt')
    // .populate('like', '')

    return res.status(200).json(post);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'internal server error' })
  }
}

async function getAllPost(req: Request, res: Response) {
  try {
    const post = await Post
      .find({}, { content: 0 })
      .populate('createdBy', 'account createdAt')
      .sort({ createdAt: -1 })
      .limit(20)
    return res.status(200).json(post);
  } catch (error) {
    console.log(error)
  }
}

async function getAllPostById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const posts = await Post
      .find({}, { content: 0 })
      .populate({
        path: 'createdBy',
        match: { account: id },
        select: 'account'
      })
      .sort({ createdAt: -1 })
      .limit(20).exec()

    const post = posts.filter(post => post.createdBy !== null)
    return res.status(200).json(post);
  } catch (error) {
    console.log(error)
  }
}

async function likePost(req: Request, res: Response) {
  const { postId } = req.params
  const user = req.user as User

  try {
    const post: IPost | null = await Post.findById(postId)
    // console.log(post)
    if (!post) throw new Error('incorrect Post id')
    await post?.likePost(postId, user._id)
    return res.json({ postLikeCount: post?.like.length })
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }

}

async function unlikePost(req: Request, res: Response) {
  const { postId } = req.params
  const user = req.user as User

  try {
    const post: IPost | null = await Post.findById(postId)
    // console.log(post)
    // if (post)
    await post?.unlikePost(postId, user._id)
    return res.json({ postLikeCount: post?.like.length })
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }

}

async function deletePost(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user

  try {
    const post = await Post.findById({ _id: id })
    if (!post) throw new Error('Invalid PostID')

    if (!post.createdBy.equals(user?._id.toString()!))
      throw new Error('You can only delete your created Posts')

    await Post.findByIdAndDelete({ _id: id })
    return res.send('Post Deleted')
  } catch (error: any) {
    return res.send(error.message)
  }
}


export {
  createPost,
  editPost,
  getPost,
  getAllPost,
  getAllPostById,
  likePost,
  unlikePost,
  deletePost
}