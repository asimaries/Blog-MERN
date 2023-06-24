import { useEffect, useContext, useState } from "react"
import { useParams } from "react-router-dom"

import { UserContext, UserContextType } from "../context/user"
import { PostCardProp } from "./Home";
import PostCard from "./PostCard";
import axios from "../api";


export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext<UserContextType>(UserContext)
  const [profile, setProfile] = useState(user)
  const [allPost, setAllPost] = useState<PostCardProp[]>([{
    _id: '',
    title: '',
    summary: '',
    cover: '',
    createdBy: {
      account: '',
    },
    createdAt: new Date(),
  }])
  // const fetchAPI = useAxiosPrivate()

  useEffect(() => {
    axios.get(`/post/allPost/${id}`).then(res => {
      setAllPost(res.data)
    })
    if (id === user.account)
      return setProfile(user)
    axios.get(`/user/profile/${id}`)
      .then(res => {
        setProfile(res.data)
      })

  }, [id, user])





  return (
    <div className="profile">
      <img src={`${import.meta.env.VITE_API_URL}/${profile.avatar.toString()}`} alt="" className="h-80" />

      <h3>{profile.name}</h3>
      <h3>{profile.account}</h3>
      <h3>{profile.role}</h3>

      {allPost.map((post, key) => {
        return <PostCard key={key} {...post} />
      })}

    </div>
  )
}
