// lib/merch.ts
export const MERCH_LIVE = true;

export type Gender = "Unisex" | "Women's";
export type ShirtStyle =
  | "Oversized Tee"
  | "Heavyweight Tee"
  | "Cropped Tee"
  | "Hoodie"
  | "Tote Bag"
  | "Trucker Hat"
  | "Art Print";
export type Size =
  | "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "4XL" | "5XL" | "OS"
  | "20x30" | "22x34" | "24x32" | "24x36" | "32x48";

export interface StyleOption {
  label: ShirtStyle;
  forGenders: Gender[];
  sizes: Size[];
  priceModifier: number;
  sizePriceModifiers?: Record<string, number>;
}

export interface MerchProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  mockups: [string, string, string];
  styles: StyleOption[];
  tag?: string;
  printifyProductId?: string;
}

export const PRODUCTS: MerchProduct[] = [
  {
    id: "hidden-gem-airbrush",
    name: "Hidden Gem Air Brush",
    tag: "New Drop",
    description: "Airbrush graphic tee. Limited run, heavy energy.",
    basePrice: 39,
    mockups: [
      "/images/merch/airbrush-1.jpg",
      "/images/merch/airbrush-2.jpg",
      "/images/merch/airbrush-3.jpg",
    ],
    styles: [
      {
        label: "Oversized Tee",
        forGenders: ["Unisex"],
        sizes: ["S", "M", "L", "XL", "2XL"],
        priceModifier: 0,
        sizePriceModifiers: { "L": 1, "XL": 1, "2XL": 7 },
      },
    ],
    printifyProductId: "6a402761b38ebb906e0692b5",
  },
  {
    id: "hidden-gem-tee",
    name: "Hidden Gem Tee",
    tag: "Best Seller",
    description: "The classic. Hidden Gem on your chest.",
    basePrice: 46,
    mockups: [
      "/images/merch/tee-1.jpg",
      "/images/merch/tee-2.jpg",
      "/images/merch/tee-3.jpg",
    ],
    styles: [
      {
        label: "Heavyweight Tee",
        forGenders: ["Unisex", "Women's"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
        priceModifier: 0,
        sizePriceModifiers: { "2XL": 2, "3XL": 4, "4XL": 6, "5XL": 8 },
      },
    ],
    printifyProductId: "6a1535ec69e138f54905134e",
  },
  {
    id: "hidden-vintage-trucker",
    name: "Hidden Vintage Trucker",
    description: "Mesh back, structured front. NOLA-coded.",
    basePrice: 34,
    mockups: [
      "/images/merch/trucker-1.jpg",
      "/images/merch/trucker-2.jpg",
      "/images/merch/trucker-3.jpg",
    ],
    styles: [
      {
        label: "Trucker Hat",
        forGenders: ["Unisex"],
        sizes: ["OS"],
        priceModifier: 0,
      },
    ],
    printifyProductId: "6a145e8598c5cbc2170dcf1b",
  },
  {
    id: "hidden-poster",
    name: "Hidden Poster",
    description: "Limited edition art print. Frame it.",
    basePrice: 45,
    mockups: [
      "/images/merch/poster-1.jpg",
      "/images/merch/poster-2.jpg",
      "/images/merch/poster-3.jpg",
    ],
    styles: [
      {
        label: "Art Print",
        forGenders: ["Unisex"],
        sizes: ["20x30", "22x34", "24x32", "24x36", "32x48"],
        priceModifier: 0,
        sizePriceModifiers: {
          "20x30": 3,   // $48
          "22x34": 4,   // $49
          "24x32": 0,   // $45
          "24x36": 5,   // $50
          "32x48": 35,  // $80
        },
      },
    ],
    printifyProductId: "6a41717777569fc62a0efa06",
  },
];

// Variant IDs pulled from Printify (shop 27644500 / jadehiddengems),
// pinned to each product's default colorway shown in the mockups above:
// Air Brush -> White, Hidden Gem Tee -> Black, Trucker -> Black/Leopard.
export const PRINTIFY_VARIANTS: Record<string, Record<string, number>> = {
  "hidden-gem-airbrush": {
    [variantKey("Oversized Tee", "S", "Unisex")]: 118089,
    [variantKey("Oversized Tee", "M", "Unisex")]: 118090,
    [variantKey("Oversized Tee", "L", "Unisex")]: 118091,
    [variantKey("Oversized Tee", "XL", "Unisex")]: 118107,
    [variantKey("Oversized Tee", "2XL", "Unisex")]: 118092,
  },
  "hidden-gem-tee": {
    [variantKey("Heavyweight Tee", "S", "Unisex")]: 117443,
    [variantKey("Heavyweight Tee", "M", "Unisex")]: 117442,
    [variantKey("Heavyweight Tee", "L", "Unisex")]: 117441,
    [variantKey("Heavyweight Tee", "XL", "Unisex")]: 117444,
    [variantKey("Heavyweight Tee", "2XL", "Unisex")]: 117437,
    [variantKey("Heavyweight Tee", "3XL", "Unisex")]: 117438,
    [variantKey("Heavyweight Tee", "4XL", "Unisex")]: 117439,
    [variantKey("Heavyweight Tee", "5XL", "Unisex")]: 117440,
    // Same physical product for Women's -- Printify has no separate
    // women's variant here, so these map to the same IDs as Unisex.
    [variantKey("Heavyweight Tee", "S", "Women's")]: 117443,
    [variantKey("Heavyweight Tee", "M", "Women's")]: 117442,
    [variantKey("Heavyweight Tee", "L", "Women's")]: 117441,
    [variantKey("Heavyweight Tee", "XL", "Women's")]: 117444,
    [variantKey("Heavyweight Tee", "2XL", "Women's")]: 117437,
    [variantKey("Heavyweight Tee", "3XL", "Women's")]: 117438,
    [variantKey("Heavyweight Tee", "4XL", "Women's")]: 117439,
    [variantKey("Heavyweight Tee", "5XL", "Women's")]: 117440,
  },
  "hidden-vintage-trucker": {
    [variantKey("Trucker Hat", "OS", "Unisex")]: 122989,
  },
  "hidden-poster": {
    [variantKey("Art Print", "20x30", "Unisex")]: 100940,
    [variantKey("Art Print", "22x34", "Unisex")]: 100942,
    [variantKey("Art Print", "24x32", "Unisex")]: 75295,
    [variantKey("Art Print", "24x36", "Unisex")]: 75296,
    [variantKey("Art Print", "32x48", "Unisex")]: 75298,
  },
};

export function variantKey(style: string, size: string, gender: string): string {
  return `${style}|${size}|${gender}`;
}

export interface CartLine {
  productId: string;
  name: string;
  style: ShirtStyle;
  size: Size;
  gender: Gender;
  qty: number;
  price: number;
  image: string;
}

export function lineId(line: CartLine): string {
  return `${line.productId}|${line.style}|${line.size}|${line.gender}`;
}

export function priceFor(product: MerchProduct, style: string, size?: string): number {
  const styleOpt = product.styles.find((s) => s.label === style);
  const baseAdjust = styleOpt?.priceModifier ?? 0;
  const sizeAdjust =
    size && styleOpt?.sizePriceModifiers
      ? (styleOpt.sizePriceModifiers[size] ?? 0)
      : 0;
  return product.basePrice + baseAdjust + sizeAdjust;
}

export function getPrintifyVariant(
  productId: string,
  style: string,
  size: string,
  gender: string
): number | null {
  const map = PRINTIFY_VARIANTS[productId];
  if (!map) return null;
  return map[variantKey(style, size, gender)] ?? null;
}

export function findProduct(id: string): MerchProduct | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Human-readable label for poster sizes */
export function formatSize(size: string): string {
  const map: Record<string, string> = {
    "20x30": '20"×30"',
    "22x34": '22"×34"',
    "24x32": '24"×32"',
    "24x36": '24"×36"',
    "32x48": '32"×48"',
  };
  return map[size] ?? size;
}
