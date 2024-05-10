const swaggerAutogen = require('swagger-autogen')()

const doc = {
  tags: [ // by default: empty Array
    {
      name: 'Users',
      description: '使用者註冊登入'
    }
  ],
  schemes: ['http', 'https'],
  host: 'newswave-backend.onrender.com',
  definitions: {
    magazineInfo: {
      status: true,
      message: '取得雜誌文章列表成功',
      data: {
        articles: [
          {
            articleId: '文章ID',
            title: '文章標題',
            tags: '文章標籤',
            publishedAt: '文章時間',
            image: '文章圖片',
            source: {
              name: '文章來源名稱',
              url: '文章來源網址'
            }
          }
        ],
        firstPage: '是否為第一頁',
        lastPage: '是否為最後頁',
        empty: '是否沒有資料',
        totalElements: '總共有幾筆資料',
        totalPages: '總共有幾頁',
        targetPage: '目前在第幾頁'
      }
    }
  }
}

const outputFile = './swagger_output.json' // 輸出的文件名稱
const endpointsFiles = ['./src/index.ts'] // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc) // swaggerAutogen 的方法
