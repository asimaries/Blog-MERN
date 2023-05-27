import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function SignIn() {

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [redirect, setRedirect] = useState<boolean>(false)

  async function signin(e: React.FormEvent) {
    e.preventDefault()
    const response: Response | any = await fetch('http://localhost:7000/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
    })
    const error = await response.json();
    if (response.status === 200) {
      setRedirect(true)
    }
    else {
      alert(error.error)
    }
  }

  if (redirect)
    return <Navigate to={'/'} />

  return (
    <>
      <form action="" className="signinForm" onSubmit={signin}>
        <h1>SignIn</h1>
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
        <button>SignIn</button>
      </form>
    </>
  )
}

