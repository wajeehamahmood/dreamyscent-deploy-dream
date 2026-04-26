import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Heart, Star, ShoppingBag } from "lucide-react";
import heroImg from "@/assets/hero-jewelry.jpg";
import { getPerfumes, Perfume } from "@/lib/api";
import PerfumeCard from "@/components/PerfumeCard";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [featured, setFeatured] = useState<Perfume[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (featured[0]) {
      addToCart(featured[0]);
      toast.success(`${featured[0].name} added to cart ✨`);
      navigate("/cart");
    }
  };

  useEffect(() => {
    getPerfumes().then((all) => setFeatured(all.slice(0, 3)));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative px-4 sm:px-8 pt-10 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-primary font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> New Spring Collection
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] mb-6">
              Find Your <br />
              <span className="text-gradient italic">Signature Sparkle</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Where jewelry meets fantasy. Curated luxury pieces crafted to capture
              dreams in every gemstone.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="btn-dream rounded-full px-7 py-3 inline-flex items-center gap-2 font-medium"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleBuyNow}
                className="glass rounded-full px-7 py-3 inline-flex items-center gap-2 font-medium hover:bg-white/70 transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Buy Now
              </button>
            </div>

            <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span>4.9 / 5 from 2,400+ reviews</span>
              </div>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-30" />
            <img
              src={heroImg}
              alt="DreamGems luxury jewelry on pastel pink silk"
              width={1536}
              height={1536}
              className="relative rounded-3xl w-full max-w-md mx-auto shadow-[var(--shadow-dream)]"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Featured</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold">
              Bestselling <span className="text-gradient italic">Treasures</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <PerfumeCard key={p.id} perfume={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              View all jewelry <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-4 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto glass-strong rounded-3xl p-8 sm:p-14 text-center">
          <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold mb-4">
            Crafted with <span className="text-gradient italic">love</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every DreamGems piece is a love letter — designed by master jewelers,
            set with ethically sourced stones, and delivered to your doorstep with a touch of magic.
            Explore delicate rings, pearl necklaces, gemstone earrings and heirloom bracelets.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { n: "120+", l: "Pieces" },
              { n: "40", l: "Jewelers" },
              { n: "25", l: "Countries" },
              { n: "100%", l: "Ethically Sourced" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-3xl text-gradient font-semibold">{s.n}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
