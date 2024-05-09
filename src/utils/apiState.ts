const apiState = {
  FAIL: {
    statusCode: 400,
    message: '失敗'
  },
  ID_ERROR: {
    statusCode: 400,
    message: 'ID格式有誤'
  },
  DATA_MISSING: {
    statusCode: 400,
    message: '資料欄位未填寫正確'
  },
  DATA_NOT_FOUND: {
    statusCode: 400,
    message: '資料不存在'
  },
  SYNTAX_ERROR: {
    statusCode: 400,
    message: 'Syntax Error，語法錯誤或非 JSON 格式'
  },
  PAGE_NOT_FOUND: {
    statusCode: 404,
    message: '找不到此網站路由'
  }
}

export { apiState }
