"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react";

import { useCart } from "@/components/cart/CartContext";
import { MenuItem } from "@/types/menu";

const categoryIcons: Record<string, string> = {
  Pizza: "🍕",
  Burgers: "🍔",
  Beverages: "🥤",
  Desserts: "🍰",
  Sides: "🍟",
};

export default function HomePage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    cartCount,
    subtotal,
  } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/menu");

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data: MenuItem[] = await response.json();

        setMenu(data);
      } catch (error) {
        console.error("Menu fetch error:", error);
        setError(
          "Unable to load the menu. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(menu.map((item) => item.category))
      ),
    ];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return menu.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const matchesSearch =
        !searchText ||
        item.name.toLowerCase().includes(searchText) ||
        item.description
          .toLowerCase()
          .includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [menu, search, selectedCategory]);

  const popularItems = useMemo(() => {
    return menu.slice(0, 4);
  }, [menu]);

  const getQuantity = (id: string) => {
    return (
      cart.find((item) => item.id === id)?.quantity ?? 0
    );
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] text-gray-900">
      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200">
              <Utensils size={21} />
            </div>

            <div>
              <p className="text-xl font-black tracking-tight">
                Foodie
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Eat • Enjoy • Repeat
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#menu"
              className="text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              Menu
            </a>

            <a
              href="#popular"
              className="text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              Popular
            </a>

            <a
              href="#why-us"
              className="text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              Why Foodie
            </a>
          </div>

          <Link
            href="/cart"
            className="relative flex h-11 items-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-bold text-white transition hover:bg-orange-500"
          >
            <ShoppingBag size={18} />

            <span className="hidden sm:block">
              Cart
            </span>

            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-gray-950">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-orange-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-300">
              <Sparkles size={15} />
              Delicious food, made for you
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Cravings?
              <br />

              <span className="text-orange-500">
                We got you.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
              Fresh, delicious meals delivered straight
              to your door. Discover your next favourite
              dish with Foodie.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#menu"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 font-black text-white shadow-xl shadow-orange-900/30 transition hover:bg-orange-400"
              >
                Order Now
                <ArrowRight
                  size={19}
                  className="transition group-hover:translate-x-1"
                />
              </a>

              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                <ShoppingBag size={19} />
                View Cart
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              <div>
                <p className="text-2xl font-black text-white">
                  4.8
                </p>

                <div className="mt-1 flex items-center gap-1">
                  <Star
                    size={13}
                    fill="currentColor"
                    className="text-orange-500"
                  />
                  <Star
                    size={13}
                    fill="currentColor"
                    className="text-orange-500"
                  />
                  <Star
                    size={13}
                    fill="currentColor"
                    className="text-orange-500"
                  />
                  <Star
                    size={13}
                    fill="currentColor"
                    className="text-orange-500"
                  />
                  <Star
                    size={13}
                    fill="currentColor"
                    className="text-orange-500"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Customer rating
                </p>
              </div>

              <div className="h-12 w-px bg-white/10" />

              <div>
                <p className="text-2xl font-black text-white">
                  25–35
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Minutes delivery
                </p>
              </div>

              <div className="h-12 w-px bg-white/10" />

              <div>
                <p className="text-2xl font-black text-white">
                  100%
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Fresh & tasty
                </p>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}

          <div className="relative mx-auto hidden h-[430px] w-full max-w-[470px] lg:block">
            <div className="absolute left-1/2 top-1/2 flex h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500/10">
              <div className="flex h-[280px] w-[280px] items-center justify-center rounded-full bg-orange-500/10">
                <div className="text-center">
                  <div className="text-[100px] leading-none">
                    🍕
                  </div>

                  <p className="mt-5 text-2xl font-black text-white">
                    Made fresh
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Just the way you like it
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-8 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                  <Flame
                    size={20}
                    className="text-white"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Today&apos;s special
                  </p>

                  <p className="font-black text-white">
                    Hot & Fresh
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500">
                  <Check
                    size={20}
                    className="text-white"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Delivery
                  </p>

                  <p className="font-black text-white">
                    Fast & reliable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK INFO ================= */}

      <section className="relative z-10 -mt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 sm:grid-cols-3">
            <div className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Clock3 size={21} />
              </div>

              <div>
                <p className="font-black">
                  Quick Delivery
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  At your door in 25–35 min
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 sm:border-l sm:border-t-0">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <Utensils size={21} />
                </div>

                <div>
                  <p className="font-black">
                    Fresh Ingredients
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Quality food made fresh
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 sm:border-l sm:border-t-0">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <MapPin size={21} />
                </div>

                <div>
                  <p className="font-black">
                    Easy Ordering
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Simple & secure checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR ================= */}

      <section
        id="popular"
        className="mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 lg:px-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-orange-500">
              <Flame size={16} />
              Trending Now
            </div>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Popular picks
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Some of the favourites our customers love.
            </p>
          </div>

          <a
            href="#menu"
            className="hidden items-center gap-1 text-sm font-bold text-orange-500 sm:flex"
          >
            View all
            <ChevronRight size={17} />
          </a>
        </div>

        {!loading && popularItems.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-orange-500">
                    Popular
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {item.category}
                      </p>

                      <h3 className="mt-1 font-black">
                        {item.name}
                      </h3>
                    </div>

                    <p className="font-black text-orange-500">
                      ₹{item.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                  >
                    <Plus size={17} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= MENU ================= */}

      <section
        id="menu"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-orange-500">
                Explore Menu
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Find your favourite
              </h2>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Search, filter and add delicious food to
                your cart.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search pizza, burger..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* CATEGORY CARDS */}

          <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const active =
                selectedCategory === category;

              const icon =
                category === "All"
                  ? "🍽️"
                  : categoryIcons[category] ?? "🍴";

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`flex min-w-fit items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    active
                      ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-100"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"
                  }`}
                >
                  <span className="text-lg">
                    {icon}
                  </span>

                  {category}
                </button>
              );
            })}
          </div>

          {/* LOADING */}

          {loading && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-gray-100"
                  >
                    <div className="h-52 animate-pulse bg-gray-200" />

                    <div className="space-y-3 p-5">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                      <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="mt-8 rounded-3xl bg-red-50 px-6 py-14 text-center">
              <p className="font-bold text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-4 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredMenu.length === 0 && (
              <div className="mt-8 rounded-3xl bg-gray-50 px-6 py-16 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                  <Search
                    size={30}
                    className="text-orange-500"
                  />
                </div>

                <h3 className="mt-5 text-xl font-black">
                  Nothing found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try another food name or category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                  className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}

          {/* FOOD GRID */}

          {!loading &&
            !error &&
            filteredMenu.length > 0 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMenu.map((item) => {
                  const quantity = getQuantity(item.id);

                  return (
                    <article
                      key={item.id}
                      className="group overflow-hidden rounded-3xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />

                        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                          {item.category}
                        </div>

                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-bold shadow-sm">
                          <Star
                            size={12}
                            fill="currentColor"
                            className="text-orange-500"
                          />
                          4.8
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-black">
                            {item.name}
                          </h3>

                          <span className="shrink-0 text-lg font-black text-orange-500">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                          {item.description}
                        </p>

                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              addToCart(item)
                            }
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 font-bold text-white transition hover:bg-orange-500"
                          >
                            <Plus size={18} />
                            Add to Cart
                          </button>
                        ) : (
                          <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50 p-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition hover:text-orange-500"
                            >
                              <Minus size={17} />
                            </button>

                            <div className="flex items-center gap-1.5 font-black">
                              <Check
                                size={16}
                                className="text-orange-500"
                              />

                              {quantity}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm transition hover:bg-orange-600"
                            >
                              <Plus size={17} />
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      {/* ================= WHY FOODIE ================= */}

      <section
        id="why-us"
        className="bg-gray-950 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-wider text-orange-500">
              Why Foodie?
            </p>

            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              More than just food.
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              We keep ordering simple, fast and enjoyable
              from the first click to the final bite.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <Utensils size={21} />
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Quality Food
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Carefully selected menu items prepared
                with fresh and quality ingredients.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <Clock3 size={21} />
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Fast Service
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                A smooth ordering experience designed to
                get your food to you quickly.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <ShoppingBag size={21} />
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Easy Ordering
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Search, add to cart, checkout and place
                your order in just a few simple steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xl font-black text-white">
              Foodie
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Good food. Good mood.
            </p>
          </div>

          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Foodie. All
            rights reserved.
          </p>
        </div>
      </footer>

      {/* ================= FLOATING CART ================= */}

      {cartCount > 0 && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <Link
            href="/cart"
            className="flex items-center justify-between rounded-2xl bg-gray-950 px-4 py-3 text-white shadow-2xl shadow-black/30 ring-1 ring-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                <ShoppingBag size={18} />
              </div>

              <div>
                <p className="text-sm font-black">
                  {cartCount}{" "}
                  {cartCount === 1 ? "item" : "items"} in
                  cart
                </p>

                <p className="text-xs text-gray-400">
                  ₹{subtotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold">
              View Cart
              <ArrowRight size={17} />
            </div>
          </Link>
        </div>
      )}
    </main>
  );
}