import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Sparkles as SparkleIcon, ShoppingBag } from "lucide-react";
import Sparkles from "./Sparkles";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/add", label: "Add Piece" },
  { to: "/manage", label: "Manage" },
  { to: "/orders", label: "Orders" },
  { to: "/contact", label: "Contact" },
];

const Layout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Sparkles />

      <header className="sticky top-0 z-40">
        <nav className="glass mx-3 mt-3 rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <SparkleIcon className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-serif text-2xl font-semibold text-gradient">
              DreamGems
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-md"
                        : "text-foreground/70 hover:text-primary hover:bg-white/40"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link
            to="/cart"
            className="relative ml-2 p-2 rounded-full hover:bg-white/40 transition-colors"
            aria-label={`Cart with ${count} items`}
          >
            <ShoppingBag className="w-5 h-5 text-foreground/80" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-primary text-primary-foreground text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/40"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground" />
          </button>
        </nav>

        {open && (
          <div className="md:hidden glass mx-3 mt-2 rounded-2xl p-3 flex flex-col gap-1 animate-fade-up">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-gradient-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-white/40"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-20 px-6 py-10 text-center">
        <div className="glass mx-auto max-w-5xl rounded-2xl py-8 px-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <SparkleIcon className="w-4 h-4 text-primary" />
            <span className="font-serif text-xl text-gradient font-semibold">
              DreamGems
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Where Jewelry Meets Fantasy · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;