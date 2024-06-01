import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { api, getBlogs } from "../api";
import { useAsync } from "../hooks/useAsync";

export interface IBlog {
  id: string,
  title: string,
  body: string,
  coverImage: string,
  user: {
    account: string,
  },
  createdAt: Date,
}


function Home() {

  //   const [allBlog, setAllBlog] = useState<IBlog[]>([{
  //     id: '',
  //     title: '',
  //     cover: '',
  //     createdBy: {
  //       account: '',
  //     },
  //     createdAt: new Date(),
  //   }])
  //   const getAllBlog = async () => {
  //     const res = await axios.get(`/blog/allBlog`)
  //     console.log(res.data)
  //     setAllBlog(res.data)
  //   }
  //   useEffect(() => {
  //     getAllBlog()
  //   }, [])

  const { loading, error, value: allBlogs } = useAsync<IBlog[]>(getBlogs)

  if (loading) return <h1>Loading...</h1>
  if (error) return <h2 className="error-msg">{error.message}</h2>
  return (
    <div className="home">
      {allBlogs!.map((item, key) => <BlogCard key={key} {...item} />)}
    </div>
  )
}


export default Home