import { AxiosResponse, AxiosError } from 'axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError
}

type Action =
  | { type: 'reset' }
  | { type: 'request'; data: any }
  | { type: 'success'; response: AxiosResponse }
  | { type: 'error'; error: AxiosError | Error }

export const doReset = (): Action => ({
  type: 'reset',
})

export const doRequest = <T>(data: T): Action => ({
  type: 'request',
  data,
})

export const doSuccess = (response: AxiosResponse): Action => ({
  type: 'success',
  response,
})

export const doError = (error: AxiosError | Error): Action => ({
  type: 'error',
  error,
})

export const createReducer = <T>() => (state: T, action: Action): T => {
  switch (action.type) {
    case 'reset':
      return { ...state, data: undefined, error: undefined }
    case 'request':
      return { ...state, data: action.data, error: undefined }
    case 'success':
      return { ...state, data: action.response.data }
    case 'error':
      const { error } = action
      let errorMessage = error.message
      if (isAxiosError(error)) {
        errorMessage = error.response?.data.message ?? errorMessage
      }
      return {
        ...state,
        error: errorMessage,
      }
    default:
      throw new Error()
  }
}
