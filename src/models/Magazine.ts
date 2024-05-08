import mongoose, { Document, Schema } from 'mongoose'

export interface IMagazine extends Document {
  categoryName: string;
  categoryId: string;
  categoryImg: string;
  categoryDescribe: string;
}

const magazineSchema = new Schema<IMagazine>(
  {
    categoryName: {
      type: String,
      required: true
    },
    categoryId: {
      type: String,
      required: true,
      unique: true
    },
    categoryDescribe: {
      type: String,
      required: true
    },
    categoryImg: {
      type: String,
      default: ''
    }
  },
  {
    versionKey: false
  }
)

const Magazine = mongoose.model('Magazine', magazineSchema)

export default Magazine
