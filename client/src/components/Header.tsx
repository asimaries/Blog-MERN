import { Link } from "react-router-dom"

const Header = () => {
  return (
    <>
      <header>
        <Link to={"/"} className='logo'>Code.to</Link>
        <nav>
          <Link to={"login"}>LogIn</Link>
          <Link to={"signup"}>SignUp</Link>
        </nav>
      </header>
    </>
  )
}


export default Header