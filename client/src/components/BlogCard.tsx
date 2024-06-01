import { Link } from "react-router-dom"
import { formatISO9075 } from "date-fns"

import { IBlog } from "./Home"

const BlogCard: React.FC<IBlog> = ({ id,
  title,
  body,
  coverImage,
  user,
  createdAt
}) => {

  return (
    <div className="blog">
      <img src={`${import.meta.env.VITE_API_URL}/${coverImage}`} alt={title} />
      <div className='blog-info'>
        <div>
          <Link to={`/blog/${id}`} >
            <h2 className='title'>{title}</h2>
            <div className="content-fade" dangerouslySetInnerHTML={{ __html: body }} />
          </Link>
        </div>
        <div className="meta-info">
          <Link className="author" to={`/profile/${user.account}`}>{user?.account}</Link>
          <p className='blogedAt'>
            {formatISO9075(new Date(createdAt))}</p>
        </div>
      </div>
    </div>
  )
}

export default BlogCard