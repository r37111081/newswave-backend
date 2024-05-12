import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: String;
  isVip: Boolean;
  subscribeExpiredAt: Date;
  collectElements: Number;
  followElements: Number;
  birthday: String;
  address: Object;
  zipcode: Number;
  detail: String;
  country: String;
  city: String;
  comparePassword: (enteredPassword: string) => boolean;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  isVip: {
    type: Boolean,
    default: false
  },
  subscribeExpiredAt: {
    type: Date,
    default: Date.now
  },
  collectElements: {
    type: Number,
    default: 0
  },
  followElements: {
    type: Number,
    default: 0
  },
  birthday: {
    type: String,
    default: ''
  },
  address: {
    zipcode: {
      type: Number,
      default: 0
    },
    detail: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    }
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
