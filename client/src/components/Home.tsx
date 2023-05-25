import Post from "./Post.tsx";

interface PostProp {
  imageURL: string,
  title: string,
  content: string,
  author: string,
  postedAt: Date
}


function Home(props: { post: PostProp[] }) {
  return (
    <div className="home">
      {props.post.map((item, key) => <Post key={key} {...item} />)}
    </div>
  )
}


export default Home