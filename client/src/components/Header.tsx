import { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import Cookies from 'js-cookie';
import jwtDecode from "jwt-decode";

import { UserContext, UserContextType } from "../context/user"
import useRefreshToken from "../hooks/useRefreshToken";
const Header = () => {

  const { user, setUser }: UserContextType = useContext<UserContextType>(UserContext)
  const refresh = useRefreshToken();
  const [runeffect, setRuneffect] = useState(false)
  useEffect(() => {
    (async () => {
      await refresh()
      setRuneffect(true)
    })()
  }, [])
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => {
      response.json().then(user => {        
        setUser(prev => { return { ...user, accessToken: prev.accessToken } })
      })
    })

  }, [runeffect])

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken: any = jwtDecode(token)
      if (decodedToken?.exp * 1000 < new Date().getTime())
        logout()
    }
  }, []);

  function logout() {
    fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      credentials: "include",
      method: "POST"
    })
    setUser({
      _id: '',
      account: '',
      name: '',
      role: '',
      avatar: '',
      accessToken: ''
    })
  }

  const username = user?.name

  return (
    <>
      <header>
        <Link to={"/"} className='logo'>Code.to</Link>
        <nav>
          {username ?
            <>
              <Link to={`/profile/${user.account}`}>
                <span>{user.account}</span>
              </Link>
              <Link to={"/create"}>Create </Link>
              <div onClick={logout}>Logout</div>
            </> : <>
              <Link to={"/signin"}>SignIn</Link>
              <Link to={"/signup"}>SignUp</Link>
            </>}
        </nav>
      </header>
    </>
  )
}


export default Header