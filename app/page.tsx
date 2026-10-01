"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  History,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";

import { useCart } from "@/components/cart/CartContext";
import { Addon, getAddonsForItem } from "@/data/addons";
import { MenuItem } from "@/types/menu";
import { Order, OrderStatus } from "@/types/order";

const categories = [
  "All",
  "Pizza",
  "Burgers",
  "Beverages",
  "Desserts",
  "Sides",
];

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    text: "Amazing food and super fast delivery. The pizza was really fresh!",
  },
  {
    name: "Priya Das",
    rating: 5,
    text: "Loved the burger and the ordering experience. Everything was smooth.",
  },
  {
    name: "Arjun Patel",
    rating: 4,
    text: "Great taste, good prices and the food arrived hot. Definitely ordering again.",
  },
];

export default function HomePage() {
  const { addToCart, cartCount, subtotal } = useCart();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [favorites, setFavorites] = useState<string[]>([]);

  const [selectedItem, setSelectedItem] =
    useState<MenuItem | null>(null);

  const [selectedAddons, setSelectedAddons] =
    useState<Addon[]>([]);

  const [currentReview, setCurrentReview] = useState(0);

  const [recentOrder, setRecentOrder] =
    useState<Order | null>(null);

  const [recentOrderLoading, setRecentOrderLoading] =
    useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        setMenuError("");

        const response = await fetch("/api/menu", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data: MenuItem[] = await response.json();

        setMenu(data);
      } catch (error) {
        console.error("Menu fetch error:", error);
        setMenuError(
          "Unable to load menu. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const loadRecentOrder = async () => {
    const orderId = localStorage.getItem(
      "foodie-last-order"
    );

    if (!orderId) {
      setRecentOrder(null);
      setRecentOrderLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(orderId)}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        setRecentOrder(null);
        return;
      }

      const data: Order = await response.json();

      setRecentOrder(data);
    } catch (error) {
      console.error(
        "Failed to load recent order:",
        error
      );
    } finally {
      setRecentOrderLoading(false);
    }
  };

  useEffect(() => {
    loadRecentOrder();

    const interval = setInterval(() => {
      loadRecentOrder();
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadRecentOrder();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  useEffect(() => {
    const savedFavorites =
      localStorage.getItem("foodie-favorites");

    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);

        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch {
        console.error(
          "Failed to load favorites"
        );
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "foodie-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

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
  }, [menu, selectedCategory, search]);

  const trendingItems = useMemo(() => {
    return menu.slice(0, 6);
  }, [menu]);

  const openCustomizeModal = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedAddons([]);
  };

  const closeCustomizeModal = () => {
    setSelectedItem(null);
    setSelectedAddons([]);
  };

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((current) => {
      const exists = current.some(
        (item) => item.id === addon.id
      );

      if (exists) {
        return current.filter(
          (item) => item.id !== addon.id
        );
      }

      return [...current, addon];
    });
  };

  const confirmAddToCart = () => {
    if (!selectedItem) return;

    addToCart(selectedItem, selectedAddons);
    closeCustomizeModal();
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );
  };

  const nextReview = () => {
    setCurrentReview(
      (current) =>
        (current + 1) % reviews.length
    );
  };

  const previousReview = () => {
    setCurrentReview(
      (current) =>
        (current - 1 + reviews.length) %
        reviews.length
    );
  };

  const selectedItemAddons = selectedItem
    ? getAddonsForItem(selectedItem)
    : [];

  const selectedAddonTotal = selectedAddons.reduce(
    (sum, addon) => sum + addon.price,
    0
  );

  const selectedItemTotal = selectedItem
    ? selectedItem.price + selectedAddonTotal
    : 0;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            foodie<span className="text-orange-500">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            <a
              href="#menu"
              className="text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              Menu
            </a>

            <a
              href="#offers"
              className="text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              Offers
            </a>

            <a
              href="#reviews"
              className="text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              Reviews
            </a>

            {/* NEW: My Orders */}
            <Link
              href="/order-history"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              <History size={16} />
              My Orders
            </Link>

            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:border-orange-300 hover:text-orange-500 md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <ShoppingBag size={19} />
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              <ShoppingCart size={18} />

              <span className="hidden sm:inline">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t bg-white md:hidden">
            <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
              <a
                href="#menu"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                Menu
              </a>

              <a
                href="#offers"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                Offers
              </a>

              <a
                href="#reviews"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                Reviews
              </a>

              {/* NEW: Mobile My Orders */}
              <Link
                href="/order-history"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                <History size={18} />
                My Orders
              </Link>

              <Link
                href="/admin/orders"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400">
              <Sparkles size={15} />
              Fresh food. Fast delivery.
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Good food,
              <br />
              <span className="text-orange-500">
                good mood.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
              Discover delicious meals made fresh for you.
              Order your favourites and enjoy a fast,
              simple food experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-black text-white transition hover:bg-orange-600"
              >
                Explore Menu
                <ArrowRight size={18} />
              </a>

              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                <ShoppingBag size={18} />
                View Cart
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-gray-800 pt-7">
              <HeroStat
                value="4.9"
                label="Rating"
              />
              <HeroStat
                value="30 min"
                label="Delivery"
              />
              <HeroStat
                value="15+"
                label="Dishes"
              />
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto h-[480px] w-full max-w-[520px] overflow-hidden rounded-[2.5rem] bg-gray-900">
              {menu[0] && (
                <Image
                  src={menu[0].image}
                  alt={menu[0].name}
                  fill
                  priority
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-7 left-7 right-7">
                <div className="rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Chef's favourite
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-white">
                    {menu[0]?.name ??
                      "Fresh & Delicious"}
                  </h2>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-black text-white">
                      ₹{menu[0]?.price ?? 249}
                    </span>

                    <span className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                      <Star
                        size={15}
                        fill="currentColor"
                      />
                      4.9
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT ORDER */}
      {!recentOrderLoading && recentOrder && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-orange-100 bg-orange-50 p-5 sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Clock3
                    size={17}
                    className="text-orange-500"
                  />

                  <p className="text-xs font-black uppercase tracking-wider text-orange-500">
                    Recent Order
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-black">
                  {recentOrder.id}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {recentOrder.items.length} item
                  {recentOrder.items.length > 1
                    ? "s"
                    : ""}{" "}
                  · ₹{recentOrder.total.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <OrderStatusBadge
                  status={recentOrder.status}
                />

                {/* FIXED: Pass order ID */}
                <Link
                  href={`/order-tracking?orderId=${encodeURIComponent(
                    recentOrder.id
                  )}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-500"
                >
                  Track Order
                  <ArrowRight size={16} />
                </Link>

                {/* NEW: Order History */}
                <Link
                  href="/order-history"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
                >
                  <History size={16} />
                  All Orders
                </Link>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              {(
                [
                  "Pending",
                  "Accepted",
                  "Preparing",
                  "Completed",
                ] as OrderStatus[]
              ).map((status, index) => {
                const statuses: OrderStatus[] = [
                  "Pending",
                  "Accepted",
                  "Preparing",
                  "Completed",
                ];

                const currentIndex =
                  statuses.indexOf(
                    recentOrder.status
                  );

                const completed =
                  index <= currentIndex;

                return (
                  <div key={status}>
                    <div
                      className={`h-1.5 rounded-full ${
                        completed
                          ? "bg-orange-500"
                          : "bg-orange-100"
                      }`}
                    />

                    <p
                      className={`mt-2 text-[9px] font-bold sm:text-xs ${
                        completed
                          ? "text-orange-600"
                          : "text-gray-400"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING */}
      {trendingItems.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-orange-500">
                <Zap size={17} fill="currentColor" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Trending now
                </span>
              </div>

              <h2 className="mt-2 text-3xl font-black">
                Popular picks
              </h2>
            </div>

            <a
              href="#menu"
              className="hidden items-center gap-1 text-sm font-bold text-orange-500 sm:flex"
            >
              View all
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-6 flex gap-4 overflow-x-auto pb-3">
            {trendingItems.map((item) => (
              <TrendingCard
                key={item.id}
                item={item}
                onAdd={() =>
                  openCustomizeModal(item)
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* OFFERS */}
      <section
        id="offers"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-orange-500 p-7 text-white">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-orange-100">
                  Today's deal
                </p>

                <h3 className="mt-2 text-3xl font-black">
                  Extra cheese,
                  <br />
                  extra happiness.
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-orange-100">
                  Customize your favourite pizza with
                  delicious extra toppings.
                </p>
              </div>

              <Sparkles
                size={42}
                className="shrink-0 text-orange-100"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-gray-950 p-7 text-white">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Fast delivery
                </p>

                <h3 className="mt-2 text-3xl font-black">
                  Hungry?
                  <br />
                  We got you.
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
                  Freshly prepared meals delivered right
                  to your doorstep.
                </p>
              </div>

              <Truck
                size={42}
                className="shrink-0 text-orange-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section
        id="menu"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-wider text-orange-500">
            Our menu
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight">
            Choose your favourite
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Browse our menu, customize your meal and
            add it to your cart.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search pizza, burger, dessert..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition ${
                selectedCategory === category
                  ? "bg-gray-950 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* MENU CONTENT */}
        {loading ? (
          <div className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white"
                >
                  <div className="h-56 animate-pulse bg-gray-100" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : menuError ? (
          <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="font-bold text-red-600">
              {menuError}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredMenu.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-gray-50 p-12 text-center">
            <Search
              size={35}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-xl font-black">
              No items found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                favorite={favorites.includes(item.id)}
                onFavorite={() =>
                  toggleFavorite(item.id)
                }
                onAdd={() =>
                  openCustomizeModal(item)
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* REVIEWS */}
      <section
        id="reviews"
        className="bg-gray-50 py-16"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-orange-500">
              Customer love
            </p>

            <h2 className="mt-2 text-3xl font-black">
              What people say
            </h2>
          </div>

          <div className="relative mt-8 rounded-3xl bg-white p-7 shadow-sm sm:p-10">
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                )
              )}
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium leading-8 text-gray-700">
              "{reviews[currentReview].text}"
            </p>

            <div className="mt-6 text-center">
              <p className="font-black">
                {reviews[currentReview].name}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Verified customer
              </p>
            </div>

            <button
              onClick={previousReview}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextReview}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-gray-950 px-6 py-12 text-center text-white sm:px-10">
          <div className="mx-auto max-w-2xl">
            <Sparkles
              size={30}
              className="mx-auto text-orange-500"
            />

            <h2 className="mt-5 text-3xl font-black sm:text-4xl">
              Ready to satisfy your cravings?
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Pick your favourite food, customize it your
              way and place your order in just a few clicks.
            </p>

            <a
              href="#menu"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-black text-white transition hover:bg-orange-600"
            >
              Order Now
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xl font-black">
              foodie<span className="text-orange-500">.</span>
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Fresh food. Fast delivery. Happy customers.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-semibold text-gray-500">
            <a
              href="#menu"
              className="hover:text-orange-500"
            >
              Menu
            </a>

            <a
              href="#offers"
              className="hover:text-orange-500"
            >
              Offers
            </a>

            {/* NEW */}
            <Link
              href="/order-history"
              className="flex items-center gap-1 hover:text-orange-500"
            >
              <History size={14} />
              My Orders
            </Link>

            <Link
              href="/cart"
              className="hover:text-orange-500"
            >
              Cart
            </Link>

            <Link
              href="/admin/orders"
              className="hover:text-orange-500"
            >
              Admin
            </Link>
          </div>
        </div>

        <div className="border-t py-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Foodie. All rights
          reserved.
        </div>
      </footer>

      {/* FLOATING CART */}
      {cartCount > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-gray-950 px-5 py-3.5 text-white shadow-2xl transition hover:bg-orange-500"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
            <ShoppingCart size={18} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400">
              {cartCount} item
              {cartCount > 1 ? "s" : ""}
            </p>

            <p className="text-sm font-black">
              ₹{subtotal.toFixed(2)}
            </p>
          </div>

          <ArrowRight size={18} />
        </Link>
      )}

      {/* CUSTOMIZATION MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
            <div className="relative h-52 overflow-hidden sm:h-60">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <button
                onClick={closeCustomizeModal}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-300">
                  Customize your order
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {selectedItem.name}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Base price
                  </p>

                  <p className="text-xl font-black">
                    ₹{selectedItem.price}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                  {selectedItem.category}
                </span>
              </div>

              {selectedItemAddons.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-lg font-black">
                    Customize
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose extra toppings or add-ons.
                  </p>

                  <div className="mt-4 space-y-2">
                    {selectedItemAddons.map(
                      (addon) => {
                        const selected =
                          selectedAddons.some(
                            (item) =>
                              item.id === addon.id
                          );

                        return (
                          <button
                            key={addon.id}
                            onClick={() =>
                              toggleAddon(addon)
                            }
                            className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                              selected
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:border-orange-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
                                  selected
                                    ? "border-orange-500 bg-orange-500 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {selected && (
                                  <Check
                                    size={15}
                                  />
                                )}
                              </div>

                              <span className="text-sm font-bold">
                                {addon.name}
                              </span>
                            </div>

                            <span className="text-sm font-black text-orange-500">
                              {addon.price === 0
                                ? "Free"
                                : `+₹${addon.price}`}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              <div className="mt-7 border-t pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      Total
                    </p>

                    <p className="text-2xl font-black text-gray-900">
                      ₹{selectedItemTotal}
                    </p>
                  </div>

                  <button
                    onClick={confirmAddToCart}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-600"
                  >
                    <Plus size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-xl font-black text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

function TrendingCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: () => void;
}) {
  return (
    <div className="w-64 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-40">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />

        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-orange-500 backdrop-blur">
          Popular
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold text-orange-500">
          {item.category}
        </p>

        <h3 className="mt-1 truncate font-black">
          {item.name}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-black">
            ₹{item.price}
          </span>

          <button
            onClick={onAdd}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white transition hover:bg-orange-500"
            aria-label={`Add ${item.name}`}
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuCard({
  item,
  favorite,
  onFavorite,
  onAdd,
}: {
  item: MenuItem;
  favorite: boolean;
  onFavorite: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-gray-700 backdrop-blur">
          {item.category}
        </span>

        <button
          onClick={onFavorite}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur transition hover:text-red-500"
          aria-label={
            favorite
              ? `Remove ${item.name} from favourites`
              : `Add ${item.name} to favourites`
          }
        >
          <Heart
            size={18}
            fill={
              favorite ? "currentColor" : "none"
            }
            className={
              favorite ? "text-red-500" : ""
            }
          />
        </button>

        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-1 text-xs font-bold">
            <Star
              size={13}
              fill="currentColor"
              className="text-yellow-400"
            />
            4.9
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-black">
          {item.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
          {item.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">
              Starting from
            </p>

            <p className="text-xl font-black">
              ₹{item.price}
            </p>
          </div>

          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-500"
          >
            <Plus size={17} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const styles: Record<OrderStatus, string> = {
    Pending: "bg-orange-100 text-orange-600",
    Accepted: "bg-blue-100 text-blue-600",
    Preparing: "bg-purple-100 text-purple-600",
    Completed: "bg-green-100 text-green-600",
  };

  const labels: Record<OrderStatus, string> = {
    Pending: "Order Received",
    Accepted: "Accepted",
    Preparing: "Preparing",
    Completed: "Completed",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-black ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}