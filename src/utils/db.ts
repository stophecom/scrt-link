import { map } from 'ramda'

export const encodeStringsForDB = map((item) =>
  typeof item === 'string' ? encodeURIComponent(item.trim()) : item,
)

export const decodeStringsFromDB = <T>(obj: T): Record<string, T[keyof T]> => {
  const result = {} as Record<string, T[keyof T]>
  Object.entries(obj).forEach(([key, value]) => {
    result[key] = typeof value === 'string' ? decodeURIComponent(value) : value
  })
  return result
}
