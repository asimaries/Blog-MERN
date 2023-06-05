import { Routes, Route } from 'react-router-dom';
import './App.css'
import HomeLayout from './components/HomeLayout';
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import Recovery from "./components/Recovery";
import Reset from "./components/Reset";
import PageNotFound from "./components/PageNotFound";
import Post from "./components/Post";
import EditPost from "./components/EditPost";
import UserContextProvider from './context/user';
import CreatePost from './components/CreatePost';
import Verify from './components/verify';


function App() {


  return (
    <UserContextProvider>
      <Routes>
        <Route element={<HomeLayout />} >
          <Route path={'/'} element={<Home />} />
          <Route path={'signin'} element={<SignIn />} />
          <Route path={'signup'} element={<SignUp />} />
          <Route path={'verify/:token'} element={<Verify />} />
          <Route path={'profile/:id'} element={<Profile />} />
          <Route path={'post/:id'} element={<Post />} />
          <Route path={'post/:id/edit'} element={<EditPost />} />
          <Route path={'recovery'} element={<Recovery />} />
          <Route path={'reset'} element={<Reset />} />
          <Route path={'create'} element={<CreatePost />} />
          <Route path={'*'} element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>

  )
}

export default App
