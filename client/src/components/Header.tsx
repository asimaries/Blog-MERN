import { useState } from "react"
import { Link } from "react-router-dom"

const Header = () => {
  // const [userLogged, setUserLogged] = useState(false)
  // if (localStorage.key())
  return (
    <>
      <header>
        <Link to={"/"} className='logo'>Code.to</Link>
       { (<nav>
          <Link to={"signin"}>SignIn</Link>
          <Link to={"signup"}>SignUp</Link>
        </nav>)}
      </header>
    </>
  )
}


export default Header