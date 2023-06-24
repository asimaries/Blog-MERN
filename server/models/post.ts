import { Document, Schema, model, Types } from "mongoose";

export interface IPost extends Document {
  title: String;
  summary: String;
  content: String;
  like: Types.ObjectId[];
  cover: String;
  createdBy: Types.ObjectId;
  likePost(postId: String, userId: String): Promise<void>;
  unlikePost(postId: String, userId: String): Promise<void>;
}

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    require: [true, "Title is required"],
    trim: true,
    maxlength: [100, "title should be less than 100 characters"]
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [500, "title should be less than 500 characters"]
  },
  content: {
    type: String,
    trim: true,
  },
  like: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  cover: {
    type: String,
  },
  createdBy: {
    require: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
  }
}, { timestamps: true })


PostSchema.methods.likePost = async function (postId: string, userId: string) {
  // console.log(this.like.find(userId))
  console.log(this.like.includes(userId))
  if (this.like.includes(userId))
    throw new Error('already liked')
  this.like.push(userId)
  await this.save()
}
PostSchema.methods.unlikePost = async function (postId: string, userId: string) {
  this.like.pull(userId)
  await this.save()
}

const Post = model<IPost>('post', PostSchema)

export { Post }