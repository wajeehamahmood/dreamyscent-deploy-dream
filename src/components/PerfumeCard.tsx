import { Perfume } from "@/lib/api";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Props {
  perfume: Perfume;
  actions?: React.ReactNode;
}

const PerfumeCard = ({ perfume, actions }: Props) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(perfume);
    toast.success(`${perfume.name} added to cart ✨`);
  };

  return (
    <article className="glass-strong rounded-3xl overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-glow)] animate-fade-up">
      <div className="aspect-[4/5] overflow-hidden bg-gradient-hero">
        <img
          src={perfume.image}
          alt={`${perfume.name} by ${perfume.brand}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80";
          }}
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="font-serif text-2xl font-semibold leading-tight">
              {perfume.name}
            </h3>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">
              {perfume.brand}
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium whitespace-nowrap">
            {perfume.category}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {perfume.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-serif text-2xl text-gradient font-semibold">
            ${perfume.price}
          </span>
          {actions ?? (
            <button
              onClick={handleAdd}
              className="btn-dream rounded-full px-4 py-2 inline-flex items-center gap-1.5 text-sm font-medium"
              aria-label={`Add ${perfume.name} to cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PerfumeCard;