const catchAsync = (func: (arg0: any, arg1: any, arg2: any) => Promise<any>) => {
  return (req: any, res: any, next: (arg0: any) => any) => {
    func(req, res, next).catch(error => next(error))
  }
}

export { catchAsync }
