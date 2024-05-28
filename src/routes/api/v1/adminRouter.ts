import express from 'express'
import { createNewsArticle } from '../../../controllers/adminController'

const router = express.Router()

router.post('/create-news-article', createNewsArticle)

export default router
