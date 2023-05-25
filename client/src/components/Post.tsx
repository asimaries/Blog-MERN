import { Link } from "react-router-dom"


interface PostProp {
  imageURL: string,
  title: string,
  content: string,
  author: string,
  postedAt: Date
}

const Post: React.FC<PostProp> = ({ imageURL, title, content, author, postedAt }: PostProp) => {
  return (
    <div className="post">
      <img src={imageURL} alt={title} />
      <div className='post-info'>
        <div>
          <h2 className='title'>{title}</h2>
          <p className='content-fade'>{content}</p>
        </div>
        <div className="meta-info">
          <Link className="author" to={"profile/:id"}>{author}</Link>
          <p className='postedAt'>{postedAt.toDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Post