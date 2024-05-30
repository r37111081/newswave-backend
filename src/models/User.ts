import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  planType: string;
  createdAt: Date;
  subscribeExpiredAt: Date;
  birthday: string;
  gender: string;
  collects: string[];
  follows: string[];
  autoRenew: boolean;
  numberOfReads: number;
  notices: {
    noticeId: string;
    read: boolean;
  }[];
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    planType: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    subscribeExpiredAt: { type: Date, default: Date.now },
    birthday: { type: String },
    gender: { type: String, default: '1', enum: ['0', '1'] },
    collects: [{ type: String, ref: 'News' }],
    follows: [{ type: String, ref: 'News' }],
    autoRenew: { type: Boolean, default: true },
    numberOfReads: { type: Number, default: 3 },
    notices: [
      {
        noticeId: { type: String, ref: 'Notice' },
        read: { type: Boolean, default: false }
      }
    ]
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
