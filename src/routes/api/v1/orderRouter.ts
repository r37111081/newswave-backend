import express from 'express'
import { getOrder, getPaymentResults } from '../../../controllers/orderController'

const router = express.Router()

router.post('/',
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
            "total":1000
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
