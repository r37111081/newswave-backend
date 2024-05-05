const appSuccess = (obj: { res: any; data: any; message: any; }) => {
  const { res, data, message } = obj
  res.send({
    status: true,
    message,
    data
  })
}
export { appSuccess }
