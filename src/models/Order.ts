import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  userId: string,
  planType: string,
  itemName: string;
  transactionId: string;
  total: number;
  payStatus: string;
  orderAt: Date;
  paidAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true
    },
    planType: {
      type: String,
      required: true
    },
    itemName: {
      // 商品名稱
      type: String,
      required: true
    },
    transactionId: {
      // 綠界交易序號 （唯一值）
      type: String,
      required: true
    },
    total: {
      // 訂單總計金額
      type: Number,
      required: true
    },
    payStatus: {
      // 付款狀態
      type: String,
      enum: ['unpaid', 'failed', 'paid'],
      required: true,
      default: 'unpaid'
    },
    orderAt: { type: Date },
    paidAt: {
      // 付款時間
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Order = mongoose.model('orders', orderSchema)

export default Order
