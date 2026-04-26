import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, Category, createPerfume } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const empty = {
  name: "",
  brand: "",
  price: "",
  category: "Floral" as Category,
  description: "",
  image: "",
};

const AddPerfume = () => {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim() || !form.description.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      toast({ title: "Enter a valid price", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await createPerfume({
        name: form.name.trim().slice(0, 100),
        brand: form.brand.trim().slice(0, 100),
        price,
        category: form.category,
        description: form.description.trim().slice(0, 500),
        image:
          form.image.trim() ||
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
      });
      toast({ title: "✨ Perfume added", description: `${form.name} joined the collection.` });
      navigate("/shop");
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-white/70 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition";

  return (
    <section className="px-4 sm:px-8 pt-10 pb-20">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10 animate-fade-up">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
          <h1 className="font-serif text-5xl font-semibold mb-3">
            Add a <span className="text-gradient italic">Perfume</span>
          </h1>
          <p className="text-muted-foreground">
            Compose a new fragrance for the DreamScents library.
          </p>
        </header>

        <form onSubmit={onSubmit} className="glass-strong rounded-3xl p-6 sm:p-10 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name *</label>
              <input className={inputCls} value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={100} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Brand *</label>
              <input className={inputCls} value={form.brand} onChange={(e) => update("brand", e.target.value)} maxLength={100} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={inputCls}
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category *</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => update("category", e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Image URL</label>
            <input
              className={inputCls}
              placeholder="https://..."
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description *</label>
            <textarea
              rows={4}
              className={inputCls + " resize-none"}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              maxLength={500}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-dream rounded-full px-8 py-3 font-medium w-full sm:w-auto disabled:opacity-60"
          >
            {submitting ? "Adding…" : "✨ Add to Collection"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddPerfume;