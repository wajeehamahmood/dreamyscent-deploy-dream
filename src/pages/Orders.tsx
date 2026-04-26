import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Package, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getOrders, deleteOrder, type Order } from "@/lib/api";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await getOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const ok = await deleteOrder(id);
      if (ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        toast.success("Order removed.");
      } else {
        toast.error("Order not found.");
      }
    } catch {
      toast.error("Could not delete the order.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <section className="px-4 sm:px-8 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Admin
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold mb-4">
            Manage <span className="text-gradient italic">Orders</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every dreamy checkout lands here. Review the details and remove
            orders once they're fulfilled.
          </p>
        </header>

        {loading ? (
          <div className="glass-strong rounded-3xl text-center py-20 px-6">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse" />
            <p className="text-muted-foreground">Gathering orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-strong rounded-3xl text-center py-20 px-6">
            <Package className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              No orders yet — your boutique is waiting for its first dream.
            </p>
            <Link
              to="/shop"
              className="btn-dream rounded-full px-7 py-3 inline-flex items-center gap-2 font-medium"
            >
              Visit Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {orders.map((order) => {
              const itemCount = order.items.reduce((s, i) => s + i.qty, 0);
              return (
                <li
                  key={order.id}
                  className="glass-strong rounded-2xl p-5 sm:p-6 animate-fade-up"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        Order
                      </p>
                      <h2 className="font-serif text-xl font-semibold">
                        #{order.id.slice(-6).toUpperCase()}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(order.createdAt)} · {itemCount} item
                        {itemCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-2xl text-gradient font-semibold">
                        ${order.total.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDelete(order.id)}
                        disabled={deletingId === order.id}
                        className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-white/60 disabled:opacity-50"
                        aria-label="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-3 border-t border-border pt-4">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 sm:gap-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            {item.brand}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          × {item.qty}
                        </p>
                        <p className="font-medium w-20 text-right">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Orders;