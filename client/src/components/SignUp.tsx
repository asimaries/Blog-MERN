import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function SignUp() {

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [redirect, setRedirect] = useState<boolean>(false)

  async function signup(e: React.FormEvent) {
    e.preventDefault()
    const response: Response | any = await fetch('http://localhost:7000/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
    })
    const message = await response.json();
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
        <h1>Signup</h1>
        <label htmlFor={"name"}>Name
          <input type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => { setName(e.target.value) }} />
        </label>

        <label htmlFor={"email"} >Email
          <input type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }} />
        </label>

        <label htmlFor="password">Password
          <input type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value) }} />
        </label>
        <button>Sign Up</button>
      </form>
    </>
  )
}

