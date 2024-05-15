const appSuccess = (obj: { res: any; data?: any; message: string; }) => {
  const { res, data, message } = obj
  res.send({
    status: true,
    message,
    data
  })
}
export { appSuccess }
