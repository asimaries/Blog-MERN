import { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"

export default function verify() {
  const [message, setMessage] = useState("Please wait verifing you email")
  const { token } = useParams()

  async function handleVerify() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify/${token}`)
    const message = await res.json();
    if (res.status == 200) {
      setTimeout(() => {
        return <Navigate to={'/login'} />
      })
    }
    setMessage(message.message)
  }

  useEffect(() => {
    handleVerify()
  }, [])

  return (
    <div>{message}</div>
  )
}
