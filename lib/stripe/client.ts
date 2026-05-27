import Stripe from "stripe";

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
}

// Singleton for server-side use (not imported at module level)
let _stripe: Stripe | null = null;
export function stripe() {
  if (!_stripe) _stripe = getStripe();
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Basic visa guides",
      "Community forum access",
      "1 active case tracker",
      "3 AI queries per day",
    ],
    limits: {
      aiQueriesPerDay: 3,
      activeCases: 1,
      documentUploads: 0,
      documentGenerations: 0,
    },
  },
  pro: {
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 149,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited AI assistant",
      "5 document uploads & analysis/month",
      "Unlimited case trackers",
      "SMS deadline reminders",
      "3 AI-generated documents/month",
      "Priority date alerts",
      "Ad-free experience",
    ],
    limits: {
      aiQueriesPerDay: -1,
      activeCases: -1,
      documentUploads: 5,
      documentGenerations: 3,
    },
  },
  premium: {
    name: "Premium",
    monthlyPrice: 49,
    yearlyPrice: 399,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Everything in Pro",
      "Unlimited document generation",
      "RFE response assistant",
      "$50/month attorney consultation credits",
      "Private community rooms",
      "Dedicated support",
    ],
    limits: {
      aiQueriesPerDay: -1,
      activeCases: -1,
      documentUploads: -1,
      documentGenerations: -1,
    },
  },
} as const;

export async function createOrRetrieveCustomer(
  clerkId: string,
  email: string,
  name: string
): Promise<string> {
  const existing = await stripe().customers.search({
    query: `metadata['clerk_id']:'${clerkId}'`,
  });

  if (existing.data.length > 0) return existing.data[0].id;

  const customer = await stripe().customers.create({
    email,
    name,
    metadata: { clerk_id: clerkId },
  });

  return customer.id;
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const session = await stripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return session.url!;
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}
