/* eslint-disable new-cap , camelcase */
import moment from 'moment'
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import Order from '../models/Order'
import User from '../models/User'
const ecpay_payment = require('ecpay_aio_nodejs')
const { MerchantID, HashKey, HashIV, PaymentReturnURL, FRONT_END_URL } = process.env
const ObjectId = require('mongodb').ObjectId

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
  const userId = req.user?._id
  // 前端在 body post itemName & total 給後端
  const { itemName, total, planType } = req.body

  if (!itemName || !total || !planType) return appError(apiState.DATA_MISSING, next)

  // 產出綠界需要的交易編號 20碼
  const MerchantTradeNo = `nwv${moment().format('YYYYMMDDHHmmssSSS')}`

  await Order.create({
    userId,
    planType,
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
    ClientBackURL: `${FRONT_END_URL}/subscription-plan/checkout/orderResult?order=${MerchantTradeNo}`,
    CustomField1: userId?.valueOf(),
    CustomField2: planType
  }

  const create = new ecpay_payment(options)

  const form = create.payment_client.aio_check_out_all(baseParam)

  return appSuccess({ res, message: '取得成功', data: form })
})

const getPaymentResults = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { CheckMacValue, PaymentDate, TradeDate, MerchantTradeNo, RtnCode, CustomField1, CustomField2 } = req.body
  const data = { ...req.body } // 原始資料
  delete data.CheckMacValue
  const create = new ecpay_payment(options)
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data)

  // 比對綠界回傳的檢查碼是否一致，若綠界未收到 1|OK ，隔5~15分鐘後重發訊息，共四次
  if (CheckMacValue === checkValue) {
    const isPaidSuccess = RtnCode === '1'
    // 付款成功: '1'
    const updateDate = isPaidSuccess
      ? {
          payStatus: 'paid',
          orderAt: moment(TradeDate),
          paidAt: moment(PaymentDate)
        }
      : {
          payStatus: 'failed'
        }

    await Order.updateOne(
      {
        userId: CustomField1,
        transactionId: MerchantTradeNo
      },
      updateDate,
      { runValidators: true }
    )

    if (isPaidSuccess) {
      await User.findByIdAndUpdate(new ObjectId(CustomField1),
        {
          isVip: true,
          planType: CustomField2,
          subscribeExpiredAt: CustomField2 === 'month' ? moment(PaymentDate).add(30, 'days') : moment(PaymentDate).add(365, 'days')
        }
      )
    }

    res.send('1|OK')
  } else {
    return appError(apiState.FAIL, next)
  }
})

export { getOrder, getPaymentResults }
