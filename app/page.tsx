"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import { MenuItem } from "@/types/menu";
import { useCart } from "@/components/cart/CartContext";

export default function Home() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch("/api/menu");

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Menu error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(menu.map((item) => item.category))],
    [menu]
  );

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menu, search, category]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="cursor-pointer">
            <h1 className="text-2xl font-black text-gray-900">
              Foodie<span className="text-orange-500">.</span>
            </h1>

            <p className="text-xs text-gray-500">
              Fresh food, delivered with love
            </p>
          </Link>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative rounded-full bg-orange-50 p-3 text-orange-600 transition hover:bg-orange-100"
          >
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-orange-500">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-100">
              Welcome to Foodie
            </p>

            <h2 className="text-4xl font-black leading-tight sm:text-6xl">
              Delicious food.
              <br />
              Made for you.
            </h2>

            <p className="mt-5 max-w-xl text-lg text-orange-100">
              Order your favourite meals and enjoy fresh, delicious
              food delivered straight to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="mx-auto -mt-7 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-lg sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-50 p-3 text-orange-500">
              <MapPin size={20} />
            </div>

            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-semibold">Bhubaneswar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-50 p-3 text-orange-500">
              <Clock size={20} />
            </div>

            <div>
              <p className="text-xs text-gray-500">Delivery Time</p>
              <p className="font-semibold">30–45 minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50">
              ⭐
            </div>

            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <p className="font-semibold">4.8 / 5</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900">
            Our Menu
          </h2>

          <p className="mt-1 text-gray-500">
            Choose something delicious.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizza, burger, dessert..."
            className="w-full rounded-xl border bg-white py-4 pl-12 pr-12 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                category === item
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 hover:bg-orange-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

            <p className="mt-4 text-gray-500">
              Loading menu...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredMenu.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-white py-20 text-center">
            <div className="text-5xl">🍽️</div>

            <h3 className="mt-4 text-xl font-bold">
              No food found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>
          </div>
        )}

        {/* Food Grid */}
        {!loading && filteredMenu.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="h-56 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>

                    <span className="whitespace-nowrap text-lg font-black text-orange-500">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                  {/* Add To Cart */}
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98]"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}