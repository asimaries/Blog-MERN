import { Request, Response } from "express";
import { Post } from "../models/post";

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
    const post = await Post
      .findOne({ _id: id })
      .populate('createdBy', 'account createdAt')
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

export { createPost, editPost, getPost, getAllPost, getAllPostById }