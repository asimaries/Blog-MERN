import Comment from "../components/Comment"

export default function CommentList({ comments }: { comments: any }) {

  return comments.map((comment: any) => (
    <div key={comment.id} >
      <Comment {...comment} />
    </ div>
  ))
}