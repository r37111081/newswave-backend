const swaggerAutogen = require('swagger-autogen')()

const doc = {
  tags: [ // by default: empty Array
    {
      name: 'Users',
      description: '使用者註冊登入'
    }
  ],
  host: 'newswave-backend.onrender.com'
}

const outputFile = './swagger_output.json' // 輸出的文件名稱
const endpointsFiles = ['./src/index.ts'] // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc) // swaggerAutogen 的方法
