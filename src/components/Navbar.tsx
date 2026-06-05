import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Store,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categories } from "@/data/categories";
import { arDigits } from "@/lib/utils";

export function Navbar() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const [q, setQ] = useState("");
  const [openCats, setOpenCats] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 shadow-card backdrop-blur">
      {/* top utility bar */}
      <div className="hidden bg-foreground text-background md:block">
        <div className="container-app flex h-9 items-center justify-between text-xs">
          <p>🇩🇿 توصيل لكل الولايات 58 · دفع عند الاستلام متاح</p>
          <div className="flex items-center gap-4">
            <Link to="/seller" className="inline-flex items-center gap-1 hover:text-accent">
              <Store size={13} /> بِع على RafikExpress
            </Link>
            <span className="inline-flex items-center gap-1">
              <Globe size={13} /> العربية · دج
            </span>
            <Link to="/account" className="hover:text-accent">
              تتبع طلبك
            </Link>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="container-app flex h-16 items-center gap-3">
        <button
          className="md:hidden"
          onClick={() => setOpenMobile(true)}
          aria-label="القائمة"
        >
          <Menu />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-lg font-black text-white shadow-card">
            R
          </span>
          <span className="hidden text-2xl font-black tracking-tight sm:block" dir="ltr">
            Rafik<span className="text-primary">Express</span>
          </span>
        </Link>

        <form onSubmit={submit} className="relative mx-auto flex w-full max-w-2xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن منتجات، علامات تجارية ومتاجر…"
            className="h-11 w-full rounded-r-full border-2 border-primary bg-background pr-5 pl-28 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="absolute left-0 top-0 h-11 rounded-l-full gradient-brand px-6 text-sm font-bold text-white"
          >
            <Search size={18} className="inline md:hidden" />
            <span className="hidden md:inline">بحث</span>
          </button>
        </form>

        <nav className="flex items-center gap-1">
          <Link
            to="/account"
            className="hidden flex-col items-center px-2 text-xs text-foreground hover:text-primary sm:flex"
          >
            <User size={20} />
            حسابي
          </Link>
          <Link
            to="/wishlist"
            className="relative hidden flex-col items-center px-2 text-xs text-foreground hover:text-primary sm:flex"
          >
            <Heart size={20} />
            المفضلة
            {wishCount > 0 && (
              <span className="absolute -top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {arDigits(wishCount)}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative flex flex-col items-center px-2 text-xs text-foreground hover:text-primary"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:block">السلة</span>
            {count > 0 && (
              <span className="absolute -top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {arDigits(count)}
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* category strip */}
      <div className="border-t border-border bg-card">
        <div className="container-app flex h-11 items-center gap-1 overflow-x-auto scrollbar-hide">
          <div className="relative">
            <button
              onClick={() => setOpenCats((v) => !v)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary"
            >
              <Menu size={16} /> كل الفئات <ChevronDown size={14} />
            </button>
            {openCats && (
              <div
                className="animate-scale-in absolute right-0 top-11 z-50 grid w-[min(90vw,520px)] grid-cols-2 gap-1 rounded-xl border border-border bg-card p-2 shadow-hover"
                onMouseLeave={() => setOpenCats(false)}
              >
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.id}`}
                    onClick={() => setOpenCats(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <span className="text-lg">{c.icon}</span> {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* mobile drawer */}
      {openMobile && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenMobile(false)} />
          <div className="animate-fade-in absolute right-0 top-0 h-full w-72 overflow-y-auto bg-card p-4 shadow-hover">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-black">القائمة</span>
              <button onClick={() => setOpenMobile(false)} aria-label="إغلاق">
                <X />
              </button>
            </div>
            <Link to="/account" onClick={() => setOpenMobile(false)} className="block rounded-lg px-3 py-2 hover:bg-muted">👤 حسابي</Link>
            <Link to="/wishlist" onClick={() => setOpenMobile(false)} className="block rounded-lg px-3 py-2 hover:bg-muted">❤️ المفضلة</Link>
            <Link to="/seller" onClick={() => setOpenMobile(false)} className="block rounded-lg px-3 py-2 hover:bg-muted">🏪 بِع على RafikExpress</Link>
            <div className="my-3 border-t border-border" />
            <p className="px-3 pb-1 text-xs font-bold text-muted-foreground">الفئات</p>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                onClick={() => setOpenMobile(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                <span>{c.icon}</span> {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
