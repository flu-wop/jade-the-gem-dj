// lib/merch.ts
//
// The storefront used to run on a hand-maintained static catalog here
// (products, sizes, a manual PRINTIFY_VARIANTS id map). That's been
// replaced by a live fetch straight from Printify — see lib/printify.ts
// (getProducts/getProduct) — so colors, sizes, and availability always
// match what's actually orderable instead of drifting out of sync with
// a file someone forgot to update. The catalog types/PRODUCTS array/
// variant map that used to live here are gone; MerchProduct and
// PrintifyVariantDetail now live in lib/printify.ts instead.
//
// This file just keeps the one unrelated site-wide toggle.

export const MERCH_LIVE = true;
