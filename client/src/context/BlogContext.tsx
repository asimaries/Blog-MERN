import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useAsync } from "../hooks/useAsync"
import { getBlogById } from "../api"
// import { BlogContextType } from "../types"


const defaultValue = {
  blog: {
    id: "", title: "", body: "", coverImage: "",
    user: { account: '' }
  },
  getReplies: (_parentId: string) => Object,
  rootComments: Object,
  createLocalComment: (_comment: any) => undefined,
  deleteLocalComment: (_id: string) => undefined,
  updateLocalComment: ({ }: { id: string, message: string }) => undefined,
  toggleLocalCommentLike: (_id: string, _addLike: Boolean) => { }
}//{ id: '' }
const BlogContext = createContext(defaultValue)

export function useBlog() {
  return useContext(BlogContext)
}


export default function BlogProvider({ children }: {
  children: ReactNode
}) {
  const { id } = useParams()
  // console.log(id)
  const { loading, error, value: blog } = useAsync(() => getBlogById(id!), [id])
  // console.log(blog)
  const [comments, setComments] = useState<any>([])

  const commentsByParentId = useMemo(() => {
    const group: any = {}
    comments.forEach((comment: any) => {
      group[comment.parentId] ||= []
      group[comment.parentId].push(comment)
    })
    return group
  }, [comments])
  // console.log(commentsByParentId)

  useEffect(() => {
    if (blog?.comments == null) return
    setComments(blog.comments)
  }, [blog?.comments])

  function createLocalComment(comment: any) {
    setComments((prevComments: any) => {
      return [comment, ...prevComments]
    })
    return undefined
  }
  function updateLocalComment({ id, message }: { id: string, message: string }) {
    setComments((prevComments: any) => {
      return prevComments.map((comment: any) => {
        if (comment.id === id)
          return { ...comment, message }
        else
          return comment
      })
    })
    return undefined
  }

  function deleteLocalComment(id: string) {
    setComments((prevComments: any) => {
      return prevComments.filter((comment: any) => comment.id !== id)
    })
    return undefined
  }

  function toggleLocalCommentLike(id: string, addLike: Boolean) {
    setComments((prevComments: any) => {
      return prevComments.map((comment: any) => {
        // console.log(comment)
        if (id === comment.id) {
          if (addLike) {
            return {
              ...comment,
              commentLikeCount: comment.commentLikeCount + 1,
              commentLikedByMe: true
            }
          } else {
            return {
              ...comment,
              commentLikeCount: comment.commentLikeCount - 1,
              commentLikedByMe: false
            }
          }
        } else {
          return comment
        }
      })
    })
  }


  function getReplies(parentId: string) {
    return commentsByParentId[parentId]
  }


  return (
    <BlogContext.Provider value={{
      blog: { id, ...blog },
      rootComments: commentsByParentId[null!],
      getReplies,
      createLocalComment,
      updateLocalComment,
      deleteLocalComment,
      toggleLocalCommentLike
    }}>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2 className="error-msg">{error.message}</h2>
      ) : (
        children
      )}
    </BlogContext.Provider>
  )
}
