import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/user";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import { api } from "../api";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { useAsyncFn } from "../hooks/useAsync";
import { useBlog } from "../context/BlogContext";
import { createComment } from "../api/comment";



export interface IBlog {
  id: string,
  title: string,
  body: string | TrustedHTML,
  coverImage: string,
  user: {
    account: string,
  }
}

export default function Blog() {



  const navigate = useNavigate()
  const { user } = useUser()
  const { id } = useParams();
  const [userLiked, setUserLiked] = useState(false)
  const likeRef = useRef<HTMLButtonElement>(null)
  // const [blog, setBlog] = useState<IBlog>({
  //   id: '',
  //   title: '',
  //   body: '',
  //   coverImage: '',
  //   user: { account: '' }
  // })

  // const getBlog = async () => {
  //   const res = await axios.get(`/blog/${id}`)
  //   // if (res.data.like.includes(user.id))
  //   //   setUserLiked(true)
  //   setBlog(res.data)
  // }
  // useEffect(() => {
  //   getBlog()
  // }, [id, userLiked])

  // const fetchAPI = useAxiosPrivate()

  // const likeBlog = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault()
  //   if (!userLiked) {
  //     const res = await fetchAPI.blog(`blog/like/${id}`)
  //     setUserLiked(true)
  //   }
  //   else {
  //     const res = await fetchAPI.blog(`blog/unlike/${id}`)
  //     setUserLiked(false)
  //   }
  //   if (likeRef.current)
  //     likeRef.current.classList.toggle('liked')
  // }


  // function deleteBlog(e: React.MouseEvent<HTMLDivElement>) {
  //   e.preventDefault()
  //   const res = fetchAPI.delete(`blog/${blog.id}`)
  //   res.then(() => {
  //     return navigate(-1)
  //   }).catch((err) => {
  //     alert(err.message)
  //   })

  // }

  // let like_button;
  // useEffect(() => {
  // }, [])

  const { blog, rootComments, createLocalComment } = useBlog()
  const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)

  function onCommentCreate(message: string) {
    return createCommentFn!({ blogId: blog.id, message }).then(createLocalComment)
  }



  return (
    <div>
      {/* {user.id ?
        <button ref={likeRef} className={`like-btn ${userLiked ? "liked" : ""}`} onClick={likeBlog}>Like {blog.like.length}</button> :
        <div>Like {blog.like.length} </div>
      } */}


      {/* {(user.account === blog.user.account) && <>
        <Link to={`/blog/${blog?.id}/edit`} className="edit-blog-btn">Edit Blog</Link>
        <div onClick={deleteBlog} className="edit-blog-btn">Delete</div>
      </>} */}




      {/* <h1>{blog?.title}</h1>
      <h2>{blog?.user.account}</h2>
      <img src={`${import.meta.env.VITE_API_URL}/${blog?.coverImage}`} alt="" />
      <div className="content" dangerouslySetInnerHTML={{ __html: blog?.body }} /> */}
      <h1>{blog.title}</h1>
      <div className="content" dangerouslySetInnerHTML={{ __html: blog?.body }} />
      <h3 className="comments-title">Comments</h3>
      <section>
        <CommentForm
          loading={loading}
          error={error!}
          onSubmit={onCommentCreate}
        />
        {rootComments != null && rootComments.length > 0 && (
          <div className="mt-4">
            <CommentList comments={rootComments} />
          </div>
        )}
      </section>
    </div>
  )
}