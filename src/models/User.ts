import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { ISubscription } from './Subscription'

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  isVip: boolean;
  subscriptions: ISubscription[];
  createdAt: Date;
  birthday: string;
  address: Object;
  zipcode: number;
  detail: string;
  country: String;
  city: string;
  collects: string[];
  follows: string[];
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    isVip: { type: Boolean, default: false },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
    createdAt: { type: Date, default: Date.now },
    birthday: { type: String, default: '' },
    address: {
      zipcode: { type: Number, default: 0 },
      detail: { type: String, default: '' },
      country: { type: String, default: '' },
      city: { type: String, default: '' }
    },
    collects: [{ type: String, ref: 'News' }],
    follows: [{ type: String, ref: 'News' }]
  },
  {
    versionKey: false
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
