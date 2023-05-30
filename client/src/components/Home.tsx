import { useEffect, useState } from "react";
import PostCard from "./PostCard";

interface PostCardProp {
  _id: string, 
  title: string,
  summary: string,
  cover: string,
  createdBy: {
    account: string,
  },
  createdAt: Date,
}


function Home() {
  const [allPost, setAllPost] = useState<PostCardProp[]>([{
    _id: '',
    title: '',
    summary: '',
    cover: '',
    createdBy: {
      account: '',
    },
    createdAt: new Date(),
  }])

  const getAllPost = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/post/allPost`)
    const posts = await res.json();
    setAllPost(posts)
  }
  useEffect(() => {
    getAllPost()
  }, [])


  return (
    <div className="home">
      {allPost.map((item, key) => <PostCard key={key} {...item} />)}
    </div>
  )
}


export default Home