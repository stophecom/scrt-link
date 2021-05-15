import useSWR from 'swr'

import { baseUrl } from '@/constants'
import { UserSettingsFields } from '@/api/models/UserSettings'
import { StatsFields } from '@/api/models/Stats'

export const useCustomer = () => {
  const { data, error } = useSWR<UserSettingsFields>(`${baseUrl}/api/me`)

  return {
    customer: data,
    isLoading: !error && !data,
    error: error,
  }
}

export const useStats = () => {
  const { data, error } = useSWR<StatsFields>(`${baseUrl}/api/stats`)

  return {
    stats: data,
    isLoading: !error && !data,
    error: error,
  }
}

export const useCustomerStats = (userId?: string) => {
  const { data, error } = useSWR<StatsFields>(`${baseUrl}/api/stats/${userId}`)

  return {
    stats: data,
    isLoading: !error && !data,
    error: error,
  }
}

export async function fetchPostJSON(url: string, data?: Record<string, unknown>) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    })
    return await response.json() // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message)
  }
}
