import { Request, Response } from "express";
// import { Blog, IBlog } from "../models/blog";
import { PrismaClient, PrismaPromise } from "@prisma/client";
const { blog: Blog, commentLike } = new PrismaClient()


export type User = {
  id: string,
  account: string,
  name: string,
  avatar: string,
}
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


async function createBlog(req: Request, res: Response) {

  const user = req.user as User
  try {
    const { title, body } = req.body;
    const path = req.file?.path as string
    const blog = await Blog.create({
      data: {
        title,
        body,
        coverImage: path,
        user: {
          connect: { id: user.id }
        }
      },
      select: {
        id: true
      }
    })
    return res.json({ blogID: blog.id })
  } catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: error.message }).send("Internal server error ")

    return res.status(error.cause.code).json({ message: error.message })
  }

}

async function editBlog(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user as User
  const { title, body } = req.body;
  try {
    const blog = await Blog.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        userId: true,
      }
    })

    if (blog?.userId != user.id)
      throw new Error('Unauthorized request you cannot edit this blog', { cause: { code: 400 } })
    // return res.status(400)
    //   .json({ error: 'unauthorized request you cannot edit this blog' })

    const file = req?.file
    let newdata: { title: string, body: string, coverImage?: string } = { title, body }
    if (file) newdata = { ...newdata, coverImage: file.path }

    await Blog.update(
      {
        where: { id: blog.id },
        data: { ...newdata }
      }
    );

    return res.status(200).json({ blogID: blog.id })
  }
  catch (error) {
    return res.status(500)
      .json({ error: 'Internal server error ' })
  }
}

async function getBlog(req: Request, res: Response) {
  /* const { id } = req.params;
  try {
    let blog = await Blog
      .findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          title: true,
          body: true,
          coverImage: true,
          user: {
            select: { account: true }
          }
        }
      })
    // .populate('createdBy', 'account createdAt')
    // .populate('like', '')
    console.log(blog)
    return res.status(200).json(blog);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'internal server error' })
  } */

  const { id } = req.params
  try {
    const blog = await Blog.findUniqueOrThrow({
      where: { id },
      select: {
        body: true,
        title: true,
        comments: {
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            _count: {
              select: {
                likes: true
              }
            }
          }
        }
      }
    }).then(async (blog) => {
      let commentLikedByMe = undefined
      console.log(req.user)
      if (req.user) {
        const commentLikes = await commentLike.findMany({
          where: {
            userId: req.user.id,
            commentId: {
              in: blog.comments.map((comment: any) => comment.id)
            }
          }
        })
        return {
          ...blog,
          comments: blog.comments.map((comment: any) => {
            const { _count, ...commentFields } = comment
            // console.log(commentFields)
            return {
              ...commentFields,
              commentLikedByMe: commentLikes.find(commentLike => commentLike.userId === commentFields.user.id),
              commentLikeCount: _count.likes
            }
          })
        }
      } else {
        return {
          ...blog,
          comments: blog.comments.map((comment: any) => {
            const { _count, ...commentFields } = comment
            return {
              ...commentFields,
              commentLikedByMe: false,
              commentLikeCount: _count.likes
            }
          })
        }
      }
    })
    // console.log(blog)
    return res.json(blog)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'internal server error' })
  }
}

async function getAllBlog(req: Request, res: Response) {
  try {
    const blogs = await Blog.findMany({
      where: {},
      select: {
        id: true,
        title: true,
        body: true,
        coverImage: true,
        createdAt: true,
        user: {
          select: {
            account: true
          }
        }
      }, orderBy: {
        createdAt: 'desc',
      },
      take: 10
    })

    // console.log(blogs)
    // .find({}, { content: 0 })
    // .populate('createdBy', 'account createdAt')
    // .sort({ createdAt: -1 })
    // .limit(20)
    return res.status(200).json(blogs);
  } catch (error) {
    console.log(error)
  }
}

async function getAllBlogOfUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    const blogs = await Blog
      .findMany({
        where: {
          user: {
            account: id
          }
        },
        select: {
          title: true,
          body: true,
          id: true,
          user: {
            select: { account: true }
          },
          coverImage: true,
          createdAt: true
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5
      })
    // console.log('155', blogs)
    // .find({}, { content: 0 })
    // .populate({
    //   path: 'createdBy',
    //   match: { account: id },
    //   select: 'account'
    // })
    // .sort({ createdAt: -1 })
    // .limit(20).exec()

    // const blog = blogs.filter(blog => blog.createdBy !== null)
    return res.status(200).json(blogs);
  } catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: error.message }).send("Internal server error ")

    return res.status(error.cause.code).json({ message: error.message })
  }

}
/* 
async function likeBlog(req: Request, res: Response) {
  const { blogId } = req.params
  const user = req.user as User

  try {
    const blog: IBlog | null = await Blog.findById(blogId)
    // console.log(blog)
    if (!blog) throw new Error('incorrect Blog id')
    await blog?.likeBlog(blogId, user._id)
    return res.json({ blogLikeCount: blog?.like.length })
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }

}

async function unlikeBlog(req: Request, res: Response) {
  const { blogId } = req.params
  const user = req.user as User

  try {
    const blog: IBlog | null = await Blog.findById(blogId)
    // console.log(blog)
    // if (blog)
    await blog?.unlikeBlog(blogId, user._id)
    return res.json({ blogLikeCount: blog?.like.length })
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }

} */

async function deleteBlog(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user as User

  try {
    const blog = await Blog.findUniqueOrThrow({ where: { id } })
    if (!blog)
      throw new Error('Blog Not Found', { cause: { code: 404 } })

    if (blog.userId != user?.id)
      throw new Error('This blog belongs to some other user', { cause: { code: 403 } })

    await Blog.delete({ where: { id } })
    return res.send('Blog Deleted')
  } catch (error: any) {
    console.error(error)
    if (!(error.cause.code))
      return res.status(500).json({ message: error.message }).send("Internal server error ")

    return res.status(error.cause.code).json({ message: error.message })
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

export {
  createBlog,
  editBlog,
  getBlog,
  getAllBlog,
  getAllBlogOfUser,
  // likeBlog,
  // unlikeBlog,
  deleteBlog
}