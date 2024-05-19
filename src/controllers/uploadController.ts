import { NextFunction, Request, Response } from 'express'
import firebaseAdmin from '../connections/firebase'
import { v4 as uuidv4 } from 'uuid'
import { catchAsync } from '../utils/catchAsync'
import { appSuccess } from '../utils/appSuccess'
import { appError } from '../middleware/errorMiddleware'
import { apiState } from '../utils/apiState'

const bucket = firebaseAdmin.storage().bucket()

const uploadImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 取得上傳的檔案資訊
  const file = req.file
  if (!file) {
    return appError(apiState.FAIL, next)
  }

  // 基於檔案的原始名稱建立一個 blob 物件
  const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`)

  // 建立一個可以寫入 blob 的物件
  const blobStream = blob.createWriteStream()

  // 監聽上傳狀態,當上傳完成時,會觸發 finish 事件
  blobStream.on('finish', () => {
    // 設定檔案的存取權限
    const config = {
      action: 'read' as any,
      expires: '2500-12-31' // 使用 'YYYY-MM-DD' 格式
    }

    // 取得檔案的網址
    blob.getSignedUrl(config, (err, imgUrl) => {
      if (err) {
        return appError(apiState.FAIL, next)
      }
      appSuccess({ res, data: { imgUrl }, message: '上傳成功' })
    })
  })

  // 如果上傳過程中發生錯誤,會觸發 error 事件
  blobStream.on('error', () => {
    return appError(apiState.FAIL, next)
  })

  // 將檔案的 buffer 寫入 blobStream
  blobStream.end(file.buffer)
})

const getImageList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 取得檔案列表
  const [files] = await bucket.getFiles()
  if (files.length === 0) {
    return appSuccess({ res, message: '目前沒有資料' })
  }
  const data: { fileName: string; imgUrl: string }[] = []

  for (const file of files) {
    // 取得檔案的簽署 URL
    const [fileUrl] = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' })
    data.push({ fileName: file.name, imgUrl: fileUrl })
  }
  appSuccess({ res, data, message: '取得檔案列表成功' })
})

export { uploadImage, getImageList }
