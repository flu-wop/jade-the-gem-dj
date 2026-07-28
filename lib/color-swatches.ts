// lib/color-swatches.ts
//
// Printify variant color names are free text from the underlying print
// provider's blueprint, so this is a best-effort map covering common
// apparel color names. Unmapped names fall back to a neutral gray swatch
// with the name as a tooltip — never silently invisible.

const COLOR_HEX: Record<string, string> = {
  white: "#F5F3EF",
  black: "#0A0A0A",
  "solid black": "#0A0A0A",
  navy: "#1B2438",
  "navy blue": "#1B2438",
  charcoal: "#3A3A3A",
  "dark grey": "#3A3A3A",
  "dark gray": "#3A3A3A",
  grey: "#8C8C8C",
  gray: "#8C8C8C",
  "heather grey": "#A8A8A8",
  "heather gray": "#A8A8A8",
  "sport grey": "#B4B4B4",
  "sport gray": "#B4B4B4",
  olive: "#5C5A3E",
  "olive green": "#5C5A3E",
  "military green": "#4B5320",
  forest: "#233D2C",
  "forest green": "#233D2C",
  "hunter green": "#1F3D2B",
  maroon: "#5C1A24",
  cardinal: "#8A1538",
  red: "#B0242A",
  burgundy: "#5E1F2E",
  orange: "#D9631E",
  gold: "#C9A24B",
  yellow: "#E8C547",
  mustard: "#C9A63B",
  royal: "#2A4B9B",
  "royal blue": "#2A4B9B",
  "true royal": "#2A4B9B",
  blue: "#3B5CA8",
  "sky blue": "#7FB3D5",
  "powder blue": "#A9C4D6",
  teal: "#2C6E6B",
  sage: "#8A9A7B",
  purple: "#5B3E7D",
  violet: "#6B4E8E",
  lavender: "#C3B4D9",
  pink: "#D998A8",
  "heather pink": "#D998A8",
  "powder pink": "#E8C4CE",
  rose: "#C97B8A",
  brown: "#5A4635",
  chocolate: "#3E2E22",
  mocha: "#6B4E3D",
  shadow: "#4A4540",
  sand: "#C9B896",
  natural: "#E4DCC8",
  cream: "#EDE4D3",
  ivory: "#F1EAD9",
  oatmeal: "#D9CFBB",
  khaki: "#B6A57A",
  tan: "#C2A878",
  fawn: "#C9A876",
  "ash grey": "#C6C6C0",
  "ash gray": "#C6C6C0",
  mint: "#A9D3C1",
  turquoise: "#3FA3A0",
  coral: "#E37B6B",
  peach: "#F0B896",
  sherbet: "#F2B87A",
  leopard: "#8A6D3B",
  floral: "#C888A8",
  stripes: "#6B7B8C",
  camo: "#5C5F45",
  "polka dots": "#C6A8C2",
};

export function colorHex(name: string): string {
  const key = name.trim().toLowerCase();
  return COLOR_HEX[key] ?? "#6B6B6B"; // neutral fallback — never invisible
}

// Light swatches need a dark border to stay visible against a dark UI
// (white, cream, ivory, etc. would otherwise vanish on a near-black background).
const LIGHT_THRESHOLD = 200; // simple luminance check

export function isLightColor(name: string): boolean {
  const hex = colorHex(name).replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > LIGHT_THRESHOLD;
}
