import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function SignUp() {

  const [name, setName] = useState<string>('')
  const [account, setAccount] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [redirect, setRedirect] = useState<boolean>(false)

  async function signup(e: React.FormEvent) {

    e.preventDefault()
    const response: Response | any = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ name, account, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
    })

    const message = await response.json();
    if (response.status === 200) {
      alert(message.message)
      setRedirect(true)
    }
    else
      alert(message.error)
  }


  return (
    redirect ? <Navigate to={'/signin'} /> : <>
      <form className="signupForm" onSubmit={signup}>
        <h1 className="text-3xl">Signup</h1>
        <label htmlFor={"name"}>Name</label>
        <input type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={name}
          onChange={(e) => { setName(e.target.value) }} />


        <label htmlFor={"account"} >Email or Phone no. </label>
        <input type="text"
          name="account"
          id="account"
          placeholder="Email or Phone no."
          value={account}
          onChange={(e) => { setAccount(e.target.value) }} />


        <label htmlFor="password">Password</label>
        <input type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }} />

        <button>Sign Up</button>
      </form>
    </>

  )
}

