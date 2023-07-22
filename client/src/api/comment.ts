import { requestPrivate } from "./";

export function createComment({ blogId, message, parentId }: { blogId: string, message: any, parentId: string }) {

  // console.log(message)
  return requestPrivate(`/comment/${blogId}`, {
    method: "POST",
    data: { message, parentId }
  })
}

export function updateComment({ blogId, message, id }: { blogId: string, message: any, id: string }) {
  return requestPrivate(`/comment/${blogId}/${id}`, {
    method: 'PATCH', data: { message }
  })
}

export function deleteComment({ blogId, id }: { blogId: string, id: string }) {
  return requestPrivate(`/comment/${blogId}/${id}`, {
    method: 'DELETE'
  })
}

export function toggleCommentLike({ blogId, id }: { blogId: string, id: string }) {
  return requestPrivate(`/comment/${blogId}/${id}/toggleLike`, {
    method: 'POST'
  })
} 