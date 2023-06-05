import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext, UserContextType } from "../context/user";

export default function SignIn() {

  const [account, setAccount] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [redirect, setRedirect] = useState<boolean>(false)
  const { setUser } = useContext<UserContextType>(UserContext)

  async function signin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const response: Response | any = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
      method: 'POST',
      body: JSON.stringify({ account, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
    })
    const data = await response.json();
    if (response.status === 200) {
      setUser(data.user)
      setRedirect(true)
    }
    else {
      alert(data.error)
    }
  }

  return (
    redirect ? <Navigate to={'/'} /> : <>
      <form action="" className="signinForm" onSubmit={signin}>
        <h1 className="text-3xl">SignIn</h1>
        <label htmlFor={"account"} >Email or Phone no. </label>
        <input type="text"
          name="account"
          placeholder="Email or Phone no."
          value={account}
          onChange={(e) => { setAccount(e.target.value) }} />
        <label htmlFor="password">Password</label>
        <input type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }} />
        <button>SignIn</button>
      </form>
    </>
  )
}

