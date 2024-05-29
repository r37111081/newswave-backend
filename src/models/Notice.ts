import mongoose, { Document, Schema } from 'mongoose'

export interface INotice extends Document {
  articleId: string,
  topic: string[],
  title: string,
  publishedAt: string,
  image: string
}

const noticeSchema = new Schema<INotice>(
  {
    articleId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    topic: { type: [String], required: true },
    image: { type: String, default: '' },
    publishedAt: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

const Notice = mongoose.model('Notice', noticeSchema)

export default Notice
