import moment from 'moment'
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import Order from '../models/Order'
// eslint-disable-next-line new-cap, camelcase
const ecpay_payment = require('ecpay_aio_nodejs')
const { MerchantID, HashKey, HashIV, PaymentReturnURL, FRONT_END_URL } = process.env

// 設定檔
const options = {
  OperationMode: 'Test', // Test or Production
  MercProfile: {
    MerchantID,
    HashKey,
    HashIV
  },
  IgnorePayment: [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
  ],
  IsProjectContractor: false
}

const getOrder = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  // 前端在 body post itemName & total 給後端
  const { itemName, total } = req.body

  if (!itemName || !total) return appError(apiState.DATA_MISSING, next)

  // 產出綠界需要的交易編號 20碼
  const MerchantTradeNo = `nwv${moment().format('YYYYMMDDHHmmssSSS')}`

  const order = await Order.create({
    itemName,
    transactionId: MerchantTradeNo,
    total,
    payStatus: 'unpaid'
  })

  const baseParam = {
    MerchantID,
    MerchantTradeNo,
    MerchantTradeDate: moment().format('YYYY/MM/DD HH:mm:ss'),
    PaymentType: 'aio',
    TotalAmount: `${total}`,
    TradeDesc: '方案訂閱',
    ItemName: itemName,
    ReturnURL: PaymentReturnURL,
    ChoosePayment: 'ALL',
    EncryptType: 1,
    ClientBackURL: `${FRONT_END_URL}/subscription-plan/checkout/orderResult`
  }

  // eslint-disable-next-line new-cap
  const create = new ecpay_payment(options)
  const form = create.payment_client.aio_check_out_all(baseParam)
  appSuccess({ res, message: '取得成功', data: form })
})

const getPaymentResults = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  // CustomField1 這個是orderId
  const { RtnCode, PaymentDate, CustomField1 } = req.body

  if (!PaymentDate || !CustomField1) return appError(apiState.DATA_MISSING, next)
  if (RtnCode === '1') {
    // 付款成功
    await Order.findByIdAndUpdate(
      CustomField1,
      {
        $set: {
          payStatus: 'paid',
          paidAt: new Date(PaymentDate).toISOString()
        }
      },
      { new: true, runValidators: true }
    )
    res.send('1|OK')
  } else {
    // 付款失敗
    await Order.findByIdAndUpdate(
      CustomField1,
      {
        $set: {
          payStatus: 'failed'
        }
      },
      { new: true, runValidators: true }
    )
    res.send('付款失敗')
  }
})

export { getOrder, getPaymentResults }
