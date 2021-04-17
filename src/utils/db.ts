export const encodeStringsForDB = <T>(obj: T = {} as T): Record<string, T[keyof T]> => {
  const result = {} as Record<string, T[keyof T]>
  Object.entries(obj).forEach(([key, value]) => {
    result[key] = typeof value === 'string' ? encodeURIComponent(value.trim()) : value
  })
  return result
}

export const decodeStringsFromDB = <T>(obj: T = {} as T): Record<string, T[keyof T]> => {
  const result = {} as Record<string, T[keyof T]>
  Object.entries(obj).forEach(([key, value]) => {
    result[key] = typeof value === 'string' ? decodeURIComponent(value) : value
  })
  return result
}
