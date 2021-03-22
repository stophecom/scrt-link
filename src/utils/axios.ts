import { AxiosResponse, AxiosError } from 'axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError
}

type Action =
  | { type: 'request' }
  | { type: 'success'; response: AxiosResponse }
  | { type: 'error'; error: AxiosError | Error }

export const doRequest = (): Action => ({
  type: 'request',
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
    case 'request':
      return { ...state, data: undefined, error: undefined }
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
