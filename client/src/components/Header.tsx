import { useEffect,useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext, UserContextType } from "../context/user"

const Header = () => {
  const { user, setUser }: UserContextType = useContext<UserContextType>(UserContext)

  useEffect(() => {
  fetch(`http://localhost:7000/user/profile`, {
      credentials: 'include',
    }).then(response => {
      response.json().then(user => {
        setUser(user)
      })

    })
  }, [])
  function logout() {
    fetch('http://localhost:7000/auth/logout', {
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
          {!username &&
            <>
              <Link to={"/signin"}>SignIn</Link>
              <Link to={"/signup"}>SignUp</Link>
            </>
          }
          {username && <>
            <button><Link to={`/profile/${user.account}`}>{user.account}</Link></button>
            <button><Link to={"/create"}>Create </Link></button>
            <button onClick={logout}>Logout</button>
          </>}
        </nav>
      </header>
    </>
  )
}


export default Header