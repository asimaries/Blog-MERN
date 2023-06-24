import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom"
import { UserContext } from "../context/user";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import axios from "../api";

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
  like: String[]
}

export default function Post() {

  const { user } = useContext(UserContext)
  const { id } = useParams();
  const [userLiked, setUserLiked] = useState(false)
  const likeRef = useRef<HTMLButtonElement>(null)
  const [post, setPost] = useState<IPost>({
    _id: '',
    title: '',
    summary: '',
    content: '',
    cover: '',
    createdBy: { account: '', _id: '' },
    like: []
  })

  const getPost = async () => {
    const res = await axios.get(`/post/${id}`)
    if (res.data.like.includes(user._id))
      setUserLiked(true)
    setPost(res.data)
  }
  useEffect(() => {
    getPost()
  }, [id, userLiked])

  const fetchAPI = useAxiosPrivate()

  const likePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!userLiked) {
      const res = await fetchAPI.post(`post/like/${id}`)
      setUserLiked(true)
    }
    else {
      const res = await fetchAPI.post(`post/unlike/${id}`)
      setUserLiked(false)
    }
    if (likeRef.current)
      likeRef.current.classList.toggle('liked')
  }
  // let like_button;
  // useEffect(() => {
  // }, [])

  return (
    <div>
      {(user._id === post.createdBy._id) &&
        <Link to={`/post/${post?._id}/edit`} className="edit-post-btn">Edit Post</Link>}

      {user._id ?
        <button ref={likeRef} className={`like-btn ${userLiked ? "liked" : ""}`} onClick={likePost}>Like {post.like.length}</button> :
        <div>Like {post.like.length} </div>
      }


      <h1>{post?.title}</h1><h2>{post?.createdBy.account}</h2><p>{post?.summary}</p><img src={`${import.meta.env.VITE_API_URL}/${post?.cover}`} alt="" /><div className="content" dangerouslySetInnerHTML={{ __html: post?.content }} />

    </div>
  )
}