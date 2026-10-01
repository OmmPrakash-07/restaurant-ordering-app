"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Utensils,
} from "lucide-react";

import { useCart } from "@/components/cart/CartContext";
import { MenuItem } from "@/types/menu";

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
    return menu.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        item.name.toLowerCase().includes(searchText) ||
        item.description
          .toLowerCase()
          .includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [menu, search, selectedCategory]);

  const getQuantity = (id: string) => {
    return (
      cart.find((item) => item.id === id)?.quantity ?? 0
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
              <Utensils size={21} />
            </div>

            <div>
              <p className="text-xl font-black leading-none text-gray-900">
                Foodie
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Taste made easy
              </p>
            </div>
          </Link>

          <Link
            href="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-orange-500">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-white/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <Star
                size={15}
                fill="currentColor"
              />
              Delicious food, delivered with love
            </div>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Good food.
              <br />
              Good mood.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-orange-50 sm:text-lg">
              Discover delicious meals, order your
              favourites, and enjoy great food without
              leaving your home.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-orange-500 shadow-lg transition hover:bg-orange-50"
              >
                Explore Menu
                <ArrowRight size={18} />
              </a>

              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <ShoppingBag size={18} />
                View Cart
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-orange-50">
              <div className="flex items-center gap-2">
                <Clock size={17} />
                25–35 min
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={17} />
                Fast delivery
              </div>

              <div className="flex items-center gap-2">
                <Star
                  size={17}
                  fill="currentColor"
                />
                4.8 rating
              </div>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <div className="relative flex h-80 w-80 items-center justify-center rounded-full bg-white/10">
              <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white/10">
                <div className="text-center">
                  <Utensils
                    size={80}
                    className="mx-auto text-white"
                  />

                  <p className="mt-5 text-xl font-black text-white">
                    Fresh & Tasty
                  </p>

                  <p className="mt-1 text-sm text-orange-100">
                    Made for food lovers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESTAURANT INFO */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Star
                size={20}
                fill="currentColor"
              />
            </div>

            <div>
              <p className="font-bold text-gray-900">
                4.8 / 5
              </p>
              <p className="text-xs text-gray-500">
                Customer rating
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Clock size={20} />
            </div>

            <div>
              <p className="font-bold text-gray-900">
                25–35 min
              </p>
              <p className="text-xs text-gray-500">
                Average delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <MapPin size={20} />
            </div>

            <div>
              <p className="font-bold text-gray-900">
                Your location
              </p>
              <p className="text-xs text-gray-500">
                Fast local delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section
        id="menu"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
              Our Menu
            </p>

            <h2 className="mt-1 text-3xl font-black text-gray-900 sm:text-4xl">
              What are you craving?
            </h2>

            <p className="mt-2 text-gray-500">
              Choose from our delicious selection.
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
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
              placeholder="Search food..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const active =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-orange-500 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="h-52 animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                    <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 px-6 py-12 text-center">
            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredMenu.length === 0 && (
            <div className="mt-10 rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                <Search
                  size={32}
                  className="text-orange-500"
                />
              </div>

              <h3 className="mt-5 text-xl font-black text-gray-900">
                No food found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try a different search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
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
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                        {item.category}
                      </div>

                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
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
                        <h3 className="text-lg font-black text-gray-900">
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
                          onClick={() => addToCart(item)}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
                        >
                          <Plus size={18} />
                          Add to Cart
                        </button>
                      ) : (
                        <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50 p-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm transition hover:text-orange-500"
                          >
                            <Minus size={17} />
                          </button>

                          <div className="flex items-center gap-1">
                            <Check
                              size={16}
                              className="text-orange-500"
                            />

                            <span className="font-black text-gray-900">
                              {quantity}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
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
      </section>

      {/* CTA */}
      {cartCount > 0 && (
        <section className="border-t bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="text-lg font-black text-gray-900">
                Ready to place your order?
              </p>

              <p className="mt-1 text-sm text-gray-500">
                You have {cartCount}{" "}
                {cartCount === 1 ? "item" : "items"} in
                your cart.
              </p>
            </div>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white transition hover:bg-orange-600"
            >
              View Cart
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-black text-white">
              Foodie
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Delicious food. Simple ordering.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Check size={16} />
            Fresh food • Fast delivery
          </div>
        </div>
      </footer>
    </main>
  );
}