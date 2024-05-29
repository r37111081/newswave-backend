import mongoose, { Document, Schema } from 'mongoose'

export interface INews extends Document {
  articleId: string;
  topic: string[];
  editor: string;
  title: string;
  publishedAt: string;
  imageDescribe: string;
  image: string;
  content: string;
  source: {
    name: string;
    url: string;
  };
}

const newsSchema = new Schema<INews>(
  {
    articleId: {
      type: String,
      required: true,
      unique: true
    },
    topic: {
      type: [String],
      required: true
    },
    editor: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    publishedAt: {
      type: String,
      required: true
    },
    imageDescribe: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      required: true
    },
    source: {
      name: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      }
    }
  },
  {
    versionKey: false
  }
)

const News = mongoose.model('New', newsSchema)

export default News
