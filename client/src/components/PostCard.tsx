import { Link } from "react-router-dom"
import { formatISO9075 } from "date-fns"

interface IPost {
  _id: string,
  title: string,
  summary: string,
  cover: string,
  createdBy: {
    account: string,
  },
  createdAt: Date,
}

const PostCard: React.FC<IPost> = ({ _id,
  title,
  summary,
  cover,
  createdBy,
  createdAt
}) => {



  return (
    <div className="post">
      <img src={`${import.meta.env.VITE_API_URL}/${cover}`} alt={title} />
      <div className='post-info'>
        <div>
          <Link to={`/post/${_id}`} >
            <h2 className='title'>{title}</h2>
            <p className='content-fade'>{summary}</p>
          </Link>
        </div>
        <div className="meta-info">
          <Link className="author" to={`/profile/${createdBy.account}`}>{createdBy?.account}</Link>
          <p className='postedAt'>
            {formatISO9075(new Date(createdAt))}</p>
        </div>
      </div>
    </div>
  )
}

export default PostCard