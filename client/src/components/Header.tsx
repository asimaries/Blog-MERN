import { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import Cookies from 'js-cookie';
import jwtDecode from "jwt-decode";
import axios from "../api";
import { UserContext, UserContextType } from "../context/user"
import useRefreshToken from "../hooks/useRefreshToken";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const Header = () => {

  const { user, setUser }: UserContextType = useContext<UserContextType>(UserContext)

  const [runGetProfile, setRunGetProfile] = useState(false)
  const refresh = useRefreshToken()
  const fetchAPI = useAxiosPrivate()
  const getProfile = async () => {
    const res = await fetchAPI.get(`/user/profile`)
    setUser(prev => { return { ...res.data, accessToken: prev.accessToken } })
  }

  useEffect(() => {
    (async () => {
      console.log('header mounting ')
      await refresh()
      setRunGetProfile(true)
    })()
  }, [])

  useEffect(() => {
    getProfile()
  }, [runGetProfile])


  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken: any = jwtDecode(token)
      if (decodedToken?.exp * 1000 < new Date().getTime())
        logout()
    }
  }, []);

  function logout() {
    axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, {
      withCredentials: true,
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
  const userLive = user.name
  return (
    <>
      <header>
        <Link to={"/"} className='logo'>Code.to</Link>
        <nav>
          {userLive ?
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




