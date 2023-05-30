import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom"
import { UserContext } from "../context/user";

export interface IPost {
  _id: string,
  title: string,
  summary: string,
  content: string | TrustedHTML,
  cover: string,
  createdBy: {
    _id: string,
    account: string,
  },
}

export default function Post() {

  const { user } = useContext(UserContext)
  const { id } = useParams();

  const [post, setPost] = useState<IPost>({
    _id: '',
    title: '',
    summary: '',
    content: '',
    cover: '',
    createdBy: { account: '', _id: '' },
  })

  const getPost = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/post/${id}`)
    const respost = await res.json();
    setPost(respost)
  }
  useEffect(() => {
    getPost()
  }, [id])

  return (
    <div>
      {(user._id === post.createdBy._id) &&
        <Link to={`/post/${post?._id}/edit`} className="edit-post-btn">Edit Post</Link>}
        
      <h1>{post?.title}</h1>
      <h2>{post?.createdBy.account}</h2>
      <p>{post?.summary}</p>

      <img src={`${import.meta.env.VITE_API_URL}/${post?.cover}`} alt="" />

      <div className="content" dangerouslySetInnerHTML={{ __html: post?.content }} />

    </div>
  )
}