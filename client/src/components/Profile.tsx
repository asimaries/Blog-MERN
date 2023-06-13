import { useEffect, useContext, useState } from "react"
import { useParams, Link } from "react-router-dom"

import { User, UserContext, UserContextType } from "../context/user"

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext<UserContextType>(UserContext)
  const [profile, setProfile] = useState(user)
  useEffect(() => {
    if (id !== user.account) {
      fetch(`${import.meta.env.VITE_API_URL}/user/profile/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`
        }
      }).then(response => {
        response.json().then(user => {
          setProfile(user)
        })
      })
    }
    else {
      setProfile(user)
    }
  }, [id])
  const [allUsers, setAllUsers] = useState<User[]>([user])

  const fetchALlusers = async () => {

    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/profileall`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`
      }
    })
    const data = await res.json();
    setAllUsers(data)
  }
  useEffect(() => {
    fetchALlusers()
  }, [])

  return (
    <div className="profile">
      <img src={`${import.meta.env.VITE_API_URL}/${profile.avatar.toString()}`} alt="" className="h-80" />

      <h3>{profile.name}</h3>
      <h3>{profile.account}</h3>
      <h3>{profile.role}</h3>

      {allUsers.map((user, key) => {
        return <div key={key}>
          <Link to={`/profile/${user.account}`}>
            {user.account}
          </Link>
        </div>
      })}

    </div>
  )
}
