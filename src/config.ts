export const env: string = process.env.NEXT_PUBLIC_ENV || 'development'
export const isDevelopment = env === 'development'
export const isProduction = env === 'production'
