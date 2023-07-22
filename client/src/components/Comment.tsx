import { FaHeart, FaReply, FaEdit, FaTrash, FaRegHeart } from "react-icons/fa"
import IconBtn from "./IconBtn"
import { useBlog } from "../context/BlogContext"
import { useState } from "react"
import CommentList from "./CommentList"
import CommentForm from "./CommentForm"
import { createComment, deleteComment, updateComment, toggleCommentLike } from "../api/comment"
import { useAsyncFn } from "../hooks/useAsync"
import { useUser } from "../context/user"


const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short"
})

export default function Comment({ id, message, user, createdAt, commentLikeCount, commentLikedByMe }: { id: string, message: any, user: any, createdAt: any, commentLikeCount: Number, commentLikedByMe: Boolean }) {

  const { user: client } = useUser()

  const [areChildrenHidden, setAreChildrenHidden] = useState(true)
  const { blog,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike
  } = useBlog()
  const childComments = getReplies(id)
  const [isReplying, setReplying] = useState(false)
  const [isEditing, setEditing] = useState(false)
  const createCommentFn = useAsyncFn(createComment)
  const updateCommentFn = useAsyncFn(updateComment)
  const deleteCommentFn = useAsyncFn(deleteComment)
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike)

  function onCommentReply(message: string) {
    return createCommentFn
      .execute!({ blogId: blog.id, message, parentId: id })
      .then(comment => {
        setReplying(false)
        createLocalComment(comment)
      })
  }

  function onCommentUpdate(message: string) {
    return updateCommentFn
      .execute!({ blogId: blog.id, message, id })
      .then(comment => {
        setEditing(false)
        updateLocalComment({ id: id, message: comment.message })
      })
  }

  function onCommentDelete() {
    return deleteCommentFn
      .execute!({ blogId: blog.id, id })
      .then(comment => {
        deleteLocalComment(comment.id)
      })
  }

  function onToggleCommentLike() {
    return toggleCommentLikeFn
      .execute!({ id, blogId: blog.id })
      .then(({ addLike }) =>
        toggleLocalCommentLike(id, addLike)
      )
  }
  // console.log(commentLikeCount, commentLikedByMe)
  // console.log(`rendering Comment ${message}`)
  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user.name}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        {isEditing ? <CommentForm
          autoFocus
          initialValue={message}
          onSubmit={onCommentUpdate}
          loading={updateCommentFn.loading}
          error={updateCommentFn.error}
        /> : <div className="message">{message}</div>}

        <div className="footer">

          <IconBtn
            onClick={onToggleCommentLike}
            disable={toggleCommentLikeFn.loading}
            Icon={commentLikedByMe ? FaHeart : FaRegHeart}
            aria-label="Like">
            {commentLikeCount}
          </IconBtn>

          <IconBtn
            onClick={() => setReplying(prev => !prev)}
            isActive={isReplying}
            Icon={FaReply}
            aria-label="Reply" />
          {(user.id == client.id) && <>
            <IconBtn
              onClick={() => setEditing(prev => !prev)}
              isActive={isEditing}
              Icon={FaEdit}
              aria-label="Edit" />

            <IconBtn
              disable={deleteCommentFn.loading}
              onClick={onCommentDelete}
              Icon={FaTrash}
              aria-label="Delete"
              color="danger" />
          </>}
        </div>
      </div>
      {isReplying && (
        <div className="mt-1 ml-3">
          <CommentForm autoFocus onSubmit={onCommentReply} loading={createCommentFn.loading} error={createCommentFn.error} />
        </div>
      )}
      {childComments?.length > 0 && (
        <>
          <div className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""}`}>
            <button className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)} />
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}>
            Show Replies
          </button>
        </>
      )}
    </>
  )

}