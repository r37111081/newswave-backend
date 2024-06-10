import express from 'express'
import { updateSubscriptionRenew } from '../../../controllers/memberController'

const router = express.Router()

router.patch('/auto-renew',
  /*
    * #swagger.tags= ['Members']
      #swagger.description = '更新訂閱續訂狀態'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['autoRenew'] = {
        in: 'path',
        description: 'autoRenew',
        required: true,
        type: 'boolean'
      }
      #swagger.responses[200] = {
        description: '狀態更新成功',
        schema: {
          status: true,
          message: '狀態更新成功'
        }
      }
    */
  updateSubscriptionRenew)

export default router
