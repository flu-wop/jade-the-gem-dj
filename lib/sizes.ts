// lib/sizes.ts
// Printify's variant order reflects internal catalog order, not logical size
// order — left unsorted, "2XL" can easily end up first, which would make a
// product default to 2XL instead of a sane middle size like M/L.

import type { PrintifyVariantDetail } from "./printify";

const SIZE_ORDER = [
  "XS", "S", "M", "L", "XL",
  "2XL", "3XL", "4XL", "5XL", "6XL", "7XL",
  "ONE SIZE",
];

function rank(size: string): number {
  const i = SIZE_ORDER.indexOf(size.trim().toUpperCase());
  return i === -1 ? SIZE_ORDER.length : i; // unknown sizes sort last, not first
}

export function sortSizes<T>(items: T[], getSize: (item: T) => string): T[] {
  return [...items].sort((a, b) => rank(getSize(a)) - rank(getSize(b)));
}

// Picks a sensible default size to pre-select, preferring M then L then S
// then whatever's first after sorting — never defaults to a plus size.
export function defaultSize(sizes: string[]): string | undefined {
  const sorted = [...sizes].sort((a, b) => rank(a) - rank(b));
  return sorted.find((s) => ["M", "L", "S"].includes(s.trim().toUpperCase())) ?? sorted[0];
}

// Finds a variant option's value by category (e.g. 'size', 'color') using a
// substring match on Printify's own resolved option name, not an exact one —
// Printify's option name for "size" isn't always literally "Size"/"Sizes"
// (the poster blueprint calls it "Art & wall decor sizes", for example).
export function optionValue(v: PrintifyVariantDetail, key: "size" | "color"): string | undefined {
  return v.options.find((o) => o.id.includes(key))?.value;
}
