import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, Category, getPerfumes, Perfume } from "@/lib/api";
import PerfumeCard from "@/components/PerfumeCard";

const Shop = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");

  useEffect(() => {
    getPerfumes().then((p) => {
      setPerfumes(p);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return perfumes.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [perfumes, search, category]);

  return (
    <section className="px-4 sm:px-8 pt-10 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Boutique</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold mb-4">
            The <span className="text-gradient italic">Collection</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse, search and filter our complete library of dreamy jewelry.
          </p>
        </header>

        <div className="glass rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/70 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === c
                    ? "bg-gradient-primary text-primary-foreground shadow-md"
                    : "bg-white/60 text-foreground/70 hover:bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading dreams…</div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl text-center py-20 text-muted-foreground">
            No pieces match your search.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <PerfumeCard key={p.id} perfume={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;