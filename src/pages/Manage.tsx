import { useEffect, useState } from "react";
import { CATEGORIES, Category, deletePerfume, getPerfumes, Perfume, updatePerfume } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Save, X } from "lucide-react";

const Manage = () => {
  const [list, setList] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Perfume>>({});

  const load = () => {
    setLoading(true);
    getPerfumes().then((p) => {
      setList(p);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const startEdit = (p: Perfume) => {
    setEditing(p.id);
    setDraft({ ...p });
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!draft.name?.trim() || !draft.brand?.trim()) {
      toast({ title: "Name and brand are required", variant: "destructive" });
      return;
    }
    await updatePerfume(editing, {
      name: draft.name!.trim().slice(0, 100),
      brand: draft.brand!.trim().slice(0, 100),
      price: Number(draft.price) || 0,
      category: draft.category as Category,
      description: (draft.description || "").trim().slice(0, 500),
      image: draft.image || "",
    });
    toast({ title: "✨ Updated", description: `${draft.name} saved.` });
    cancelEdit();
    load();
  };

  const remove = async (p: Perfume) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await deletePerfume(p.id);
    toast({ title: "Deleted", description: `${p.name} removed.` });
    load();
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg bg-white/80 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

  return (
    <section className="px-4 sm:px-8 pt-10 pb-20">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10 animate-fade-up">
          <h1 className="font-serif text-5xl font-semibold mb-3">
            Manage <span className="text-gradient italic">Perfumes</span>
          </h1>
          <p className="text-muted-foreground">
            Edit, update and remove fragrances from your boutique.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : list.length === 0 ? (
          <div className="glass rounded-2xl text-center py-20 text-muted-foreground">
            No perfumes yet. Add your first one!
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((p) => {
              const isEdit = editing === p.id;
              return (
                <div key={p.id} className="glass-strong rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={isEdit ? draft.image || p.image : p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full sm:w-28 h-32 sm:h-32 object-cover rounded-xl"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      {isEdit ? (
                        <div className="grid sm:grid-cols-2 gap-2">
                          <input className={inputCls} value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" />
                          <input className={inputCls} value={draft.brand || ""} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} placeholder="Brand" />
                          <input className={inputCls} type="number" value={draft.price ?? ""} onChange={(e) => setDraft({ ...draft, price: parseFloat(e.target.value) })} placeholder="Price" />
                          <select className={inputCls} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <input className={inputCls + " sm:col-span-2"} value={draft.image || ""} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="Image URL" />
                          <textarea className={inputCls + " sm:col-span-2 resize-none"} rows={2} value={draft.description || ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Description" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h3 className="font-serif text-2xl font-semibold leading-tight">{p.name}</h3>
                              <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.brand}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{p.category}</span>
                              <span className="font-serif text-xl text-gradient font-semibold">${p.price}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
                        </>
                      )}
                    </div>
                    <div className="flex sm:flex-col gap-2 sm:w-28 justify-end">
                      {isEdit ? (
                        <>
                          <button onClick={saveEdit} className="btn-dream rounded-full px-4 py-2 text-sm flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5">
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button onClick={cancelEdit} className="rounded-full px-4 py-2 text-sm bg-white/80 border border-border hover:bg-white flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5">
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(p)} className="rounded-full px-4 py-2 text-sm bg-white/80 border border-border hover:bg-white flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5">
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => remove(p)} className="rounded-full px-4 py-2 text-sm bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Manage;