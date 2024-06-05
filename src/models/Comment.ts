import mongoose, { Document, Schema } from 'mongoose'

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  article: string;
  content: string;
  publishedAt: string;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    article: { type: String, ref: 'New', required: true },
    content: { type: String, required: true },
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
