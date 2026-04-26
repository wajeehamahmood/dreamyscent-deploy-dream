import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { createOrder } from "@/lib/api";

const Cart = () => {
  const { items, total, updateQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      await createOrder({
        total,
        items: items.map(({ perfume, qty }) => ({
          id: perfume.id,
          name: perfume.name,
          brand: perfume.brand,
          price: perfume.price,
          image: perfume.image,
          qty,
        })),
      });
      toast.success("Order placed! ✨ Thank you for dreaming with us.");
      clearCart();
      navigate("/orders");
    } catch {
      toast.error("Could not place your order. Please try again.");
    }
  };

  return (
    <section className="px-4 sm:px-8 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Your Bag</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold mb-4">
            Shopping <span className="text-gradient italic">Cart</span>
          </h1>
        </header>

        {items.length === 0 ? (
          <div className="glass-strong rounded-3xl text-center py-20 px-6">
            <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">Your cart is empty — let's find your scent.</p>
            <Link
              to="/shop"
              className="btn-dream rounded-full px-7 py-3 inline-flex items-center gap-2 font-medium"
            >
              Browse Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <ul className="flex flex-col gap-4">
              {items.map(({ perfume, qty }) => (
                <li
                  key={perfume.id}
                  className="glass-strong rounded-2xl p-4 flex gap-4 items-center"
                >
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-semibold leading-tight truncate">
                      {perfume.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {perfume.brand}
                    </p>
                    <p className="text-gradient font-serif text-lg font-semibold mt-1">
                      ${perfume.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 rounded-full p-1">
                    <button
                      onClick={() => updateQty(perfume.id, qty - 1)}
                      className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => updateQty(perfume.id, qty + 1)}
                      className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(perfume.id)}
                    className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-white/60"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="glass-strong rounded-2xl p-6 h-fit lg:sticky lg:top-24">
              <h2 className="font-serif text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center mb-6">
                <span className="font-medium">Total</span>
                <span className="font-serif text-2xl text-gradient font-semibold">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="btn-dream w-full rounded-full py-3 font-medium inline-flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 text-xs text-muted-foreground hover:text-destructive py-2"
              >
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
