import mongoose, { Document, Schema } from 'mongoose'

export interface ISubscription extends Document {
  plan: string;
  subscriptionDate: string;
  expiryDate: string;
  autoRenew: Boolean;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    plan: { type: String, required: true, unique: true },
    subscriptionDate: { type: String, required: true },
    expiryDate: { type: String, default: '' },
    autoRenew: { type: Boolean, default: true }
  },
  {
    versionKey: false
  }
)

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription
