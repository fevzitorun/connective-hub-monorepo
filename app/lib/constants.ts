export const SUBSCRIPTION_TIERS = {
  free:       { name: "Ücretsiz", priceMonthly: 0,   listingLimit: 5,   currency: "TRY" },
  starter:    { name: "Başlangıç", priceMonthly: 49,  listingLimit: 20,  currency: "TRY" },
  pro:        { name: "Pro",      priceMonthly: 149, listingLimit: 100, currency: "TRY" },
  agency:     { name: "Ajans",   priceMonthly: 299, listingLimit: -1,  currency: "TRY" },
  enterprise: { name: "Kurumsal", priceMonthly: 999, listingLimit: -1,  currency: "TRY" },
} as const;
