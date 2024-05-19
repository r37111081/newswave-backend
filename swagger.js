const dotenv = require('dotenv')
const swaggerAutogen = require('swagger-autogen')()

dotenv.config()

// 根據執行環境決定主機位置
let host
let protocol

if (process.env.NODE_ENV === 'production') {
  protocol = 'https'
  host = 'newswave-backend.onrender.com'
} else {
  protocol = 'http'
  host = `localhost:${process.env.PORT || 3000}`
}

const doc = {
  tags: [
    {
      name: 'Gusets',
      description: '未登入訪客'
    },
    {
      name: 'Users',
      description: '一般使用者'
    },
    {
      name: 'Members',
      description: '訂閱使用者'
    },
    {
      name: 'Upload',
      description: '上傳檔案'
    },
    {
      name: 'Admins',
      description: '後台管理者'
    }
  ],
  schemes: [protocol],
  host,
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: '請加上 API Token'
    }
  },
  definitions: {
    magazineList: {
      status: true,
      message: '取得雜誌種類列表成功',
      data: [
        {
          categoryName: '雜誌名稱',
          categoryId: '雜誌ID',
          categoryDescribe: '雜誌描述',
          categoryImg: '雜誌圖片'
        }
      ]
    },
    articleList: {
      status: true,
      message: '取得文章列表成功',
      data: {
        articles: [
          {
            articleId: '文章ID',
            title: '文章標題',
            editor: '文章編輯',
            topics: ['文章標籤'],
            publishedAt: '文章發布時間',
            image: '文章圖片',
            imageDescription: '文章圖片描述',
            source: {
              name: '文章來源名稱',
              url: '文章來源網址'
            }
          }
        ],
        firstPage: '是否為第一頁',
        lastPage: '是否為最後一頁',
        empty: '是否沒有資料',
        totalElement: '總共有幾筆資料',
        totalPages: '總共有幾頁',
        targetPage: '目前在第幾頁'
      }
    },
    articleDetailInfo: {
      status: true,
      message: '取得文章詳情成功',
      data: {
        articles: [
          {
            articleId: '文章ID',
            title: '文章標題',
            editor: '文章編輯',
            topics: ['文章標籤'],
            publishedAt: '文章發布時間',
            image: '文章圖片',
            imageDescription: '文章圖片描述',
            content: '文章內容',
            source: {
              name: '文章來源名稱',
              url: '文章來源網址'
            }
          }
        ],
        firstPage: '是否為第一頁',
        lastPage: '是否為最後一頁',
        empty: '是否沒有資料',
        totalElement: '總共有幾筆資料',
        totalPages: '總共有幾頁',
        targetPage: '目前在第幾頁'
      }
    }
  }
}

const outputFile = './swagger_output.json' // 輸出的文件名稱
const endpointsFiles = ['./src/index.ts'] // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc) // swaggerAutogen 的方法
