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
    magazinList: {
      status: true,
      message: '取得雜誌種類列表成功',
      data: [
        {
          _id: 'ID',
          categoryName: '雜誌名稱',
          categoryId: '雜誌ID',
          categoryDescribe: '雜誌描述',
          categoryImg: '雜誌圖片'
        }
      ]
    }
  }
}

const outputFile = './swagger_output.json' // 輸出的文件名稱
const endpointsFiles = ['./src/index.ts'] // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc) // swaggerAutogen 的方法
