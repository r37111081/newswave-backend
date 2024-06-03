import express from 'express'
import { authenticate } from '../../../middleware/authMiddleware'
import { getOrder, getPaymentResults } from '../../../controllers/orderController'

const router = express.Router()

router.post('/', authenticate,
/*
    * #swagger.tags= ['Orders']
    #swagger.description = '串接綠界金流'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: {
            "itemName":"newswave 年訂閱",
            "total":1000,
            "planType":"month"
        }
    }
    #swagger.responses[200] = {
      description: '綠界回傳表單',
      schema: {
        status: true,
        message: '取得成功',
        data:"綠界回傳待前端submit表單"
      }
    }
  */
  getOrder)

router.post('/payment-results',
/*
    * #swagger.tags= ['Orders']
    #swagger.description = ''
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',綠界回傳付款是否成功
      required: true,
      description: '資料格式',
      schema: {
            "RtnCode":"1",
            "PaymentDate":"yyyy/MM/dd HH:mm:ss",
            "TradeDate":"yyyy/MM/dd HH:mm:ss",
            "CheckMacValue":"6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840",
            "MerchantTradeNo":"nwv20121225214506666",
        }
    }
    #swagger.responses[200] = {
      description: '綠界回傳表單',
      schema: {
        status: true,
        message: '取得成功',
        data:"綠界回傳待前端submit表單"
      }
    }
  */
  getPaymentResults)

export default router
