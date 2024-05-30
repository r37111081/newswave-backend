import express from 'express'
import { createNewsArticle, getNoticeList } from '../../../controllers/adminController'

const router = express.Router()

router.get('/notice-list', getNoticeList)
router.post('/create-news-article', createNewsArticle)

export default router
