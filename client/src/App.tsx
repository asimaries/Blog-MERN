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
import Blog from "./components/Blog";
import EditBlog from "./components/EditBlog";
import UserContextProvider from './context/user';
import CreateBlog from './components/CreateBlog';
import Verify from './components/verify';
import BlogProvider from './context/BlogContext'

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
          <Route path={'blog/:id'} element={
            <BlogProvider>
              <Blog />
            </BlogProvider>
          } />
          <Route path={'blog/:id/edit'} element={<EditBlog />} />
          <Route path={'recovery'} element={<Recovery />} />
          <Route path={'reset'} element={<Reset />} />
          <Route path={'create'} element={<CreateBlog />} />
          <Route path={'*'} element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>

  )
}

export default App
