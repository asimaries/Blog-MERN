import { useEffect, useContext, useState } from "react"
import { User, UserContext, UserContextType } from "../context/user"
import { useParams, Link } from "react-router-dom"

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext<UserContextType>(UserContext)
  const [profile, setProfile] = useState(user)
  useEffect(() => {
    if (id !== user.account) {
      fetch(`http://localhost:7000/user/profile/${id}`, {
        credentials: 'include',
      }).then(response => {
        response.json().then(user => {
          setProfile(user)
        })
      })
    }
    else {
      setProfile(user)
    }
    console.log('Profile render')
  }, [id])
  const [allUsers, setAllUsers] = useState<User[]>([user])

  const fetchALlusers = async () => {

    const res = await fetch(`http://localhost:7000/user/profileall`)
    const data = await res.json();
    setAllUsers(data)
  }
  useEffect(() => {
    fetchALlusers()
  }, [])
  return (
    <>
      <img src={profile.avatar.toString()} alt="" className="h-80" />
      <h3>{profile.name}</h3>
      <h3>{profile.account}</h3>
      <h3>{profile.role}</h3>
      {allUsers.map((user, key) => {
        return <div key={key}><Link to={`/profile/${user.account}`}>{user.account}</Link></div>
      })}
    </>
  )
}
