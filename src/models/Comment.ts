import mongoose, { Document, Schema } from 'mongoose'

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId;
  articleId: string;
  content: string;
  publishedAt: string;
  createdAt: Date
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    article: { type: mongoose.Schema.ObjectId, ref: 'New', required: true },
    articleId: { type: String, ref: 'New', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    publishedAt: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

commentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id
    return ret
  }
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
