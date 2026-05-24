import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const RATE = 150;
export const MIN_HOURS = 2;

export function calculateBookingTotal(hours: number, code?: string) {
  const subtotal = hours * RATE;
  const discountApplied = code?.toUpperCase() === "HIDDEN50";
  const discount = discountApplied ? hours * 50 : 0;
  const total = subtotal - discount;
  return { subtotal, discount, total, discountApplied };
}
