import { Routes, Route } from 'react-router-dom';
import './App.css'
import HomeLayout from './components/HomeLayout';
import Home from "./components/Home.tsx";
import SignIn from "./components/SignIn.tsx";
import SignUp from "./components/SignUp.tsx";
interface PostProp {
  imageURL: string,
  title: string,
  content: string,
  author: string,
  postedAt: Date
}

const post: PostProp[] = [
  {
    "imageURL": "https://miro.medium.com/v2/resize:fill:112:112/1*kqE5Ri54e6SBHd8-LYriqg.png",
    "title": "10 Must-Have VSCode Extensions for Web Development",
    "content": "In this series, we shine a spotlight on the different DEV moderators — Trusted Members and Tag Mods — who help to make DEV a ki.",
    "author": "asimarix",
    "postedAt": new Date()
  }, {
    "imageURL": "https://res.cloudinary.com/practicaldev/image/fetch/s--t_KKnETq--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0dngtyztf8adlkrmsyf4.png",
    "title": "10 Must-Have VSCode Extensions for Web Development",
    "content": "In this series, we shine a spotlight on the different DEV moderators — Trusted Members and Tag Mods — who help to make DEV a ki.",
    "author": "asimarix",
    "postedAt": new Date()
  }
]

function App() {


  return (
    <Routes>
      <Route element={<HomeLayout />} >
        <Route path={'/'} element={<Home post={post} />} />
        <Route path={'signin'} element={<SignIn />} />
        <Route path={'signup'} element={<SignUp />} />
      </Route>
    </Routes>

  )
}

export default App
