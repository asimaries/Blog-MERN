import { Schema, model, Document } from 'mongoose';
import { IUser } from './user';
import { IPost } from './post';


interface IComment extends Document {
  message: string;
  user: IUser['_id'];
  post: IPost['_id'];
  parent?: IComment['_id'];
  children: IComment['_id'][];
  likes: ILike[];
}

interface ILike extends Document {
  user: IUser['_id'];
  comment: IComment['_id'];
}


const commentSchema = new Schema<IComment>({
  message: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Like'
  }],
}, { timestamps: true });

const likeSchema = new Schema<ILike>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
}, { timestamps: true });

const CommentModel = model<IComment>('Comment', commentSchema);
const LikeModel = model<ILike>('Like', likeSchema);

export { CommentModel, LikeModel }