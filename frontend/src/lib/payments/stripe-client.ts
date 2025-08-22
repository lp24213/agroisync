import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      throw new Error('Stripe publishable key not found')
    }
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

export async function createCheckoutSession(params: {
  lineItems: Array<{
    price: string
    quantity: number
  }>
  mode: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}): Promise<string> {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    return sessionId
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function createPaymentLink(params: {
  lineItems: Array<{
    price: string
    quantity: number
  }>
  mode: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}): Promise<string> {
  try {
    const response = await fetch('/api/stripe/create-payment-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to create payment link')
    }

    const { url } = await response.json()
    return url
  } catch (error) {
    console.error('Error creating payment link:', error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string): Promise<string> {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    })

    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }

    const { url } = await response.json()
    return url
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}

export async function getSubscription(subscriptionId: string): Promise<any> {
  try {
    const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscription')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching subscription:', error)
    throw error
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  try {
    const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

export async function updateSubscription(subscriptionId: string, params: {
  priceId?: string
  quantity?: number
  metadata?: Record<string, string>
}): Promise<void> {
  try {
    const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to update subscription')
    }
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

export async function getInvoices(customerId: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/stripe/customers/${customerId}/invoices`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch invoices')
    }

    const { invoices } = await response.json()
    return invoices
  } catch (error) {
    console.error('Error fetching invoices:', error)
    throw error
  }
}

export async function getPaymentMethods(customerId: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/stripe/customers/${customerId}/payment-methods`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment methods')
    }

    const { paymentMethods } = await response.json()
    return paymentMethods
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    throw error
  }
}

export async function attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
  try {
    const response = await fetch('/api/stripe/attach-payment-method', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId, paymentMethodId }),
    })

    if (!response.ok) {
      throw new Error('Failed to attach payment method')
    }
  } catch (error) {
    console.error('Error attaching payment method:', error)
    throw error
  }
}

export async function detachPaymentMethod(paymentMethodId: string): Promise<void> {
  try {
    const response = await fetch(`/api/stripe/payment-methods/${paymentMethodId}/detach`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Failed to detach payment method')
    }
  } catch (error) {
    console.error('Error detaching payment method:', error)
    throw error
  }
}

export async function setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
  try {
    const response = await fetch('/api/stripe/set-default-payment-method', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId, paymentMethodId }),
    })

    if (!response.ok) {
      throw new Error('Failed to set default payment method')
    }
  } catch (error) {
    console.error('Error setting default payment method:', error)
    throw error
  }
}

export async function createSetupIntent(customerId: string): Promise<string> {
  try {
    const response = await fetch('/api/stripe/create-setup-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    })

    if (!response.ok) {
      throw new Error('Failed to create setup intent')
    }

    const { clientSecret } = await response.json()
    return clientSecret
  } catch (error) {
    console.error('Error creating setup intent:', error)
    throw error
  }
}

export async function confirmSetupIntent(setupIntentId: string, paymentMethodId: string): Promise<void> {
  try {
    const response = await fetch('/api/stripe/confirm-setup-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ setupIntentId, paymentMethodId }),
    })

    if (!response.ok) {
      throw new Error('Failed to confirm setup intent')
    }
  } catch (error) {
    console.error('Error confirming setup intent:', error)
    throw error
  }
}
