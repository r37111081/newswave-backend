import moment from 'moment'
import SHA256 from 'crypto-js/sha256'
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'
import Order from '../models/Order'

const getOrder = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  // 前端在 body post itemName & total 給後端
  const { itemName, total } = req.body

  if (!itemName || !total) return appError(apiState.DATA_MISSING, next)

  // 產出綠界需要的交易編號 20碼 uid
  const uid = `newswav${Date.now().toString()}`
  const MerchantTradeNo = uid

  const order = await Order.create({
    itemName,
    transactionId: MerchantTradeNo,
    total,
    payStatus: 'unpaid'
  })

  const baseParam = {
    MerchantID: process.env.MerchantID,
    MerchantTradeNo,
    MerchantTradeDate: moment().format('YYYY/MM/DD HH:mm:ss'),
    PaymentType: 'aio',
    TotalAmount: total,
    TradeDesc: 'ecpay test',
    ItemName: itemName,
    ReturnURL: process.env.PaymentReturnURL,
    ChoosePayment: 'Credit',
    EncryptType: 1,
    ClientBackURL: 'https://newswave-frontend.onrender.com/',
    CustomField1: order.id
  }

  const form = `
      <form action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="POST" name="payment" style="display: none;">
        <input name="MerchantID" value="${baseParam.MerchantID}"/>
        <input name="MerchantTradeNo" value="${baseParam.MerchantTradeNo}" />
        <input name="MerchantTradeDate" value="${baseParam.MerchantTradeDate}" />
        <input name="PaymentType" value="${baseParam.PaymentType}" />
        <input name="TotalAmount" value="${baseParam.TotalAmount}" />
        <input name="TradeDesc" value="${baseParam.TradeDesc}" />
        <input name="ItemName" value="${baseParam.ItemName}" />
        <input name="ReturnURL" value="${baseParam.ReturnURL}" />
        <input name="ChoosePayment" value="${baseParam.ChoosePayment}" />
        <input name="EncryptType" value="${baseParam.EncryptType}" />
        <input name="ClientBackURL" value="${baseParam.ClientBackURL}" />
        <input name="CheckMacValue" value="${generateCheckValue(baseParam)}" />
        <button type="submit">Submit</button>
      </form>
    `
  appSuccess({ res, message: '取得成功', data: form })
})

const getPaymentResults = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  try {
    // CustomField1 這個是orderId
    const { RtnCode, PaymentDate, CustomField1 } = req.body
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
    }
    res.status(200)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

function generateCheckValue (params: { [key: string]: any }):string {
  // 將 params 從 Object 換成 Array
  const entries = Object.entries(params)

  // 第一步，將 params 按照 key 值得字母順序排列
  entries.sort((a, b) => {
    return a[0].localeCompare(b[0])
  })

  // 第二步，用 key1=value1&key2=value2... 這樣的 pattern 將所有 params 串聯成字串
  // 並前後加上 HashKey & HashIV 的 value
  let result =
      `HashKey=${process.env.HashKey}&` +
      entries.map((x) => `${x[0]}=${x[1]}`).join('&') +
      `&HashIV=${process.env.HashIV}`

  // 第三步，encode URL 並轉換成小寫
  result = encodeURIComponent(result).toLowerCase()

  // 第四步，因爲綠姐姐的 URL encode 是 follow RFC 1866
  // 使用 js 的encodeURIComponent() 還需要處理一下
  // follow guidence from ECPay https://www.ecpay.com.tw/CascadeFAQ/CascadeFAQ_Qa?nID=1197
  result = result
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+')

  // 第五步，轉成 SHA256
  result = SHA256(result).toString()

  // 最後，轉成大寫
  return result.toUpperCase()
}

export { getOrder, getPaymentResults }
