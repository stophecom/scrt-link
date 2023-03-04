export class CustomError extends Error {
  public statusCode: number
  public i18nErrorKey?: string

  constructor(statusCode: number, message: string, i18nErrorKey?: string) {
    super(message) // 'Error' breaks prototype chain here
    this.statusCode = statusCode
    this.i18nErrorKey = i18nErrorKey
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
  }
}

// https://github.com/zeit/micro#error-handling
const createError = (statusCode: number, message: string, i18nErrorKey?: string) => {
  const err = new CustomError(statusCode, message, i18nErrorKey)
  return err
}

export default createError
