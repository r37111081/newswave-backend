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
      required: true
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
        required: true
      },
      url: {
        type: String,
        default: '',
        required: true
      }
    }
  },
  {
    versionKey: false
  }
)

newsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id
    return ret
  }
})

const News = mongoose.model('New', newsSchema)

export default News
