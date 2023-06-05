import { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import Cookies from 'js-cookie';
import jwtDecode from "jwt-decode";

import { UserContext, UserContextType } from "../context/user"

const Header = () => {
  const { user, setUser }: UserContextType = useContext<UserContextType>(UserContext)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
      credentials: 'include',
    }).then(response => {
      response.json().then(user => {
        setUser(user)
      })
    })
  }, [])

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