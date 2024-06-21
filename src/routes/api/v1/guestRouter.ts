import express from 'express'
import {
  getAllMagazine,
  getMagazineList,
  getArticleDetail,
  getHotNewsList,
  getArticleCommentList,
  getNewsPage,
  getSearchArticleList
} from '../../../controllers/guestController'
import { getUserId } from '../../../middleware/authMiddleware'

const router = express.Router()

router.get(
  '/magazine-category-list',
  /**
    #swagger.tags = ['Guests']
    #swagger.description  = "取得雜誌種類列表"
    #swagger.responses[200] = {
      description: '雜誌種類列表資訊',
      schema: { $ref: '#/definitions/magazineList' }
    }
  */
  getAllMagazine
)
router.get(
  '/magazine-article-page',
  /**
    #swagger.tags = ['Guests']
    #swagger.description  = "取得雜誌文章列表分頁"
    #swagger.parameters['pageSize'] = {
      in: 'query',
      type: 'String',
      description: '每頁數量',
    },
    #swagger.parameters['pageIndex'] = {
      in: 'query',
      type: 'String',
      description: '當前頁數',
    },
    #swagger.parameters['category'] = {
      in: 'query',
      type: 'String',
      description: '雜誌種類',
    },
    #swagger.responses[200] = {
      description: '雜誌文章列表資訊',
      schema: { $ref: '#/definitions/articleList' }
    }
  */
  getMagazineList
)
router.get('/article-detail/:articleId',
/*
  #swagger.tags= ['Guests']
  #swagger.description = '取得新聞、雜誌文章詳情'
  #swagger.parameters['articleId'] = {
    in: 'path',
    description: '文章ID',
    required: true,
    type: 'string'
  }
  #swagger.responses[200] = {
    description: '新聞、雜誌文章詳情資訊',
    schema: { $ref: '#/definitions/articleDetailInfo' }
  }
*/
  getArticleDetail)
router.get('/hot-news-list'
  /**
     * #swagger.tags = ['Guests']
     * #swagger.description  = "取得熱門新聞列表"
      }
    }s
  */
  , getHotNewsList)
router.get('/news-page'
/**
   * #swagger.tags = ['Guests']
   * #swagger.description  = "取得新聞首頁列表分頁"
*/
  , getNewsPage)
router.get('/article-comment-page/:articleId', getUserId
  /*
    #swagger.tags= ['Guests']
    #swagger.description = '取得文章留言列表'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['articleId'] = {
      in: 'path',
      description: '文章ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['pageSize'] = {
      in: 'query',
      type: 'String',
      description: '每頁數量',
    },
    #swagger.parameters['pageIndex'] = {
      in: 'query',
      type: 'String',
      description: '當前頁數',
    },
    #swagger.responses[200] = {
      description: '留言列表資訊',
      schema: { $ref: '#/definitions/guestCommentList' }
    }
  */
  , getArticleCommentList)
router.get('/search-news-page',
  /**
    #swagger.tags = ['Guests']
    #swagger.description  = "取得搜尋列表分頁"
    #swagger.parameters['pageSize'] = {
      in: 'query',
      type: 'String',
      description: '每頁數量',
    },
    #swagger.parameters['pageIndex'] = {
      in: 'query',
      type: 'String',
      description: '當前頁數',
    },
    #swagger.parameters['keyword'] = {
      in: 'query',
      type: 'String',
      description: '關鍵字',
    },
    #swagger.parameters['type'] = {
      in: 'query',
      type: 'String',
      description: 'news:新聞文章|magazine:雜誌文章',
    },
    #swagger.parameters['topic'] = {
      in: 'query',
      type: 'String',
      description: '新聞主題',
    },
    #swagger.responses[200] = {
      description: '雜誌文章列表資訊',
      schema: { $ref: '#/definitions/articleList' }
    }
  */
  getSearchArticleList)
export default router
