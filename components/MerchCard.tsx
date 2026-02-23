import { ShoppingBag } from "lucide-react";
import type { MerchItem } from "@/lib/data";

interface Props {
  item: MerchItem;
}

export default function MerchCard({ item }: Props) {
  const content = (
    <>
      {/* Product image */}
      <div
        className="relative w-full aspect-square bg-surface-2 rounded-xl overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform"
        style={
          item.image
            ? {
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Fallback icon if no image */}
        {!item.image && (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            👕
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingBag className="text-neon-green" size={32} />
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="text-center">
        <h3 className="font-bold text-white mb-1 text-sm group-hover:text-neon-green transition-colors">
          {item.name}
        </h3>
        <p className="text-neon-green font-display text-xl">{item.price}</p>
      </div>
    </>
  );

  // If there's a purchase link, make it clickable
  if (item.link) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="card p-5 hover:border-neon-green/30 transition-all group block"
      >
        {content}
      </a>
    );
  }

  // Otherwise just a static card (for coming soon items)
  return (
    <div className="card p-5 group">
      {content}
      <p className="text-white/30 text-xs text-center mt-3">Coming Soon</p>
    </div>
  );
}
