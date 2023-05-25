import { useState } from "react";

export default function Login() {

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <>
      <form action="" className="loginForm">
        <h1>Login</h1>
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
        <button>Login</button>
      </form>
    </>
  )
}

