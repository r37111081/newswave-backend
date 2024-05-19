import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

interface Address {
  detail: string;
  city: string;
  country: string;
  zipcode: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: String;
  isVip: boolean;
  subscribeExpiredAt: Date;
  collectElements: Number;
  followElements: Number;
  birthday: String;
  address: Address;
  collects: string[];
  follows: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (enteredPassword: string) => boolean;
}


const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  isVip: { type: Boolean, default: false },
  subscribeExpiredAt: { type: Date, default: Date.now },
  collectElements: { type: Number, default: 0 },
  followElements: { type: Number, default: 0 },
  birthday: { type: String, default: '' },
  address: Address,
  collects: [{ type: String, ref: 'News' }],
  follows: [{ type: String, ref: 'News' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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
