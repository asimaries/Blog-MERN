import { useContext, useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/user";
import { api, axiosapi, getGoogleOAuthURL, signin } from "../api";
import { useAsync, useAsyncFn } from "../hooks/useAsync";
import Cookies from "js-cookie";
export default function SignIn() {

  const inputRef = useRef<HTMLInputElement>(null)
  const [account, setAccount] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [redirect, setRedirect] = useState<boolean>(false)
  const { user, setUser } = useUser()

  // async function signin(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   const response: Response | any = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
  //     method: 'POST',
  //     body: JSON.stringify({ account, password }),
  //     headers: { 'Content-Type': 'application/json' },
  //     credentials: "include"
  //   })
  //   const data = await response.json();
  //   if (response.status === 200) {
  //     setUser({ ...data.user, accessToken: data.accessToken })
  //     setRedirect(true)
  //     console.log(user)
  //   }
  //   else {
  //     alert(data.error)
  //   }
  // }
  async function signin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    Cookies.remove('token')
    const data = await axiosapi.post('/auth/signin', { account, password }, {
      headers: {
        'Content-Type': 'application/json',
      }, withCredentials: true
    })
      .then(res => {
        setUser({ ...res.data.user, accessToken: res.data.accessToken })
        setRedirect(true)
        console.log(user)
      })
      .catch((error: any) => {
        // console.log(errorf)
        return Promise.reject(error?.response.data)
      })
  }
  useEffect(() => { if (inputRef.current) inputRef?.current?.focus() }, [])
  return (
    redirect ? <Navigate to={'/'} /> : <>

      <form action="" className="signinForm" onSubmit={signin}>
        <a href={getGoogleOAuthURL()}><button type="button">Signin with Google</button></a>
        <h1 className="text-3xl">SignIn</h1>
        <label htmlFor={"account"} >Email or Phone no. </label>
        <input type="text"
          ref={inputRef}
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

