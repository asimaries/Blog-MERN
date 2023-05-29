import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function SignUp() {

  const [name, setName] = useState<string>('')
  const [account, setAccount] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [redirect, setRedirect] = useState<boolean>(false)

  async function signup(e: React.FormEvent) {
    e.preventDefault()
    const response: Response | any = await fetch('http://localhost:7000/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, account, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
    })
    const message = await response.json();
    console.log(message)
    if (response.status === 200) {
      alert(message.message)
      setRedirect(true)
    }
    else alert(message.error)
  }

  if (redirect)
    return <Navigate to={'/signin'} />

  return (
    <>
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

