import { useEffect, useContext, useState } from "react"
import { useParams } from "react-router-dom"

import { useUser } from "../context/user"
import { IBlog } from "./Home";
import BlogCard from "./BlogCard";
import { api, getUserBlog } from "../api";
import { useAsyncFn } from "../hooks/useAsync";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser()
  const [profile, setProfile] = useState(user)
  const [allBlog, setAllBlog] = useState<IBlog[]>([{
    id: '',
    title: '',
    body: '',
    coverImage: '',
    user: {
      account: '',
    },
    createdAt: new Date(),
  }])
  // const fetchAPI = useAxiosPrivate()

  useEffect(() => {
    api.get(`/blog/allBlog/${id}`).then(res => {
      setAllBlog(res.data)
    })
    api.get(`/user/profile/${id}`)
      .then(res => {
        setProfile(res.data)
      })

  }, [id, user])

  return (
    <div className="profile">
      <img src={`${import.meta.env.VITE_API_URL}/${profile.avatar}`} alt="" className="h-80" />

      <h3>{profile.name}</h3>
      <h3>{profile.account}</h3>
      {/* <h3>{profile.role}</h3> */}

      {allBlog.map((blog, key) => {
        return <BlogCard key={key} {...blog} />
      })}

    </div>
  )
}
