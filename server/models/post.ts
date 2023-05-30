import { Schema, model } from "mongoose";

const PostSchema = new Schema({
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
  cover: {
    type: String,
  },
  createdBy: {
    require: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
  }
}, { timestamps: true })

const Post = model('post', PostSchema)

export { Post }