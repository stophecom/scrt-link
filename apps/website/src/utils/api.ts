import useSWR from 'swr'
import { Stripe } from 'stripe'

import { getBaseURL } from '@/utils'
import { CustomerFields } from '@/api/models/Customer'
import { StatsFields } from '@/api/models/Stats'
import { CustomError } from '@/api/utils/createError'

const baseUrl = getBaseURL()
export async function api<T>(
  url: RequestInfo,
  options?: RequestInit,
  data?: Record<string, unknown> | null,
): Promise<T> {
  try {
    // Default options are marked with *
    const response = await fetch(`${baseUrl}/api${url}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      ...options,
      ...(data ? { body: JSON.stringify(data) } : {}), // body data type must match "Content-Type" header
    })

    if (!response.ok) {
      const errorResponse = (await response.json()) as CustomError
      throw new Error(errorResponse.message ?? response.statusText)
    }

    return response.json() as Promise<T>
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Unexpected error')
  }
}

export const useCustomer = () => {
  const { data, mutate, error } = useSWR<CustomerFields>(`${baseUrl}/api/me`)

  return {
    customer: data,
    role: data?.role || 'visitor',
    isVisitor: !data?.userId, // If no customer is returned
    isFree: data?.role === 'free',
    isPremium: data?.role === 'premium',
    mutate,
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

// Stripe
type Plan = {
  name: string
  id: string
  prices: { monthly: Stripe.Price; yearly: Stripe.Price }
}
export type Plans = Plan[]

export const usePlans = (currency?: string) => {
  const { data, error } = useSWR<Plans | undefined>(`${baseUrl}/api/plans?currency=${currency}`)

  return {
    plans: data,
    isLoading: !error && !data,
    error: error,
  }
}

// Currently not used
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

export const useStripeCustomer = (customerId?: string) => {
  const { data, mutate, error } = useSWR<Stripe.Customer>(
    () => `${baseUrl}/api/customers/${customerId}`,
  )

  return {
    stripeCustomer: data,
    triggerFetchStripeCustomer: mutate,
    isLoading: !error && !data,
    error: error,
  }
}

export const useSubscription = () => {
  const { customer } = useCustomer()
  const { stripeCustomer } = useStripeCustomer(customer?.stripe?.customerId)

  // We assume a customer only ever has one subscription
  const subscription = stripeCustomer?.subscriptions?.data[0]

  const { data, mutate, error } = useSWR<Stripe.Customer>(
    () => `${baseUrl}/api/subscriptions/products/${subscription?.items.data[0].price.product}`,
  )

  return {
    subscription,
    productName: data?.name,
    hasActiveSubscription: subscription?.status === 'active',
  }
}
