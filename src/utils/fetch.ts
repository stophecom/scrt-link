import useSWR from 'swr'
import { Stripe } from 'stripe'

import { baseUrl } from '@/constants'
import { CustomerFields } from '@/api/models/Customer'
import { StatsFields } from '@/api/models/Stats'

export const useCustomer = () => {
  const { data, error } = useSWR<CustomerFields>(`${baseUrl}/api/me`)

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

export const useCheckoutSession = (checkoutSessionId?: string) => {
  const { data, error } = useSWR(
    checkoutSessionId ? `${baseUrl}/api/checkout/${checkoutSessionId}` : null,
  )

  return {
    checkoutSession: data,
    isLoading: !error && !data,
    error: error,
  }
}

export const useSubscription = () => {
  const { data: customer } = useSWR<CustomerFields>(`${baseUrl}/api/me`)

  const { data, error } = useSWR(() =>
    customer ? `${baseUrl}/api/subscription/${customer?.stripe?.subscription}` : null,
  )

  return {
    subscription: data,
    isLoading: !error && !data,
    error: error,
  }
}

type Plan = {
  name: string
  prices: { monthly: Stripe.Price; yearly: Stripe.Price }
}
export const usePlans = () => {
  const { data, error } = useSWR<Plan[]>(`${baseUrl}/api/plans`)

  return {
    plans: data,
    isLoading: !error && !data,
    error: error,
  }
}

export async function fetchJSON(
  url: string,
  data?: Record<string, unknown>,
  options?: Record<string, unknown>,
) {
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
      ...options,
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    })
    return await response.json() // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message)
  }
}
