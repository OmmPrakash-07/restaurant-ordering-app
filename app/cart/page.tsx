"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Utensils,
} from "lucide-react";

import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    tax,
    total,
  } = useCart();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#fffaf7]">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-black text-orange-500"
            >
              <Utensils size={27} />
              Foodie
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-500"
            >
              <ArrowLeft size={17} />
              Back to Menu
            </Link>
          </div>
        </header>

        <section className="flex min-h-[75vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <ShoppingBag
                size={42}
                className="text-orange-500"
              />
            </div>

            <h1 className="mt-6 text-3xl font-black">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Looks like you haven't added anything
              yet.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white hover:bg-orange-600"
            >
              Explore Menu
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-black text-orange-500"
          >
            <Utensils size={27} />
            Foodie
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-500"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-wider text-orange-500">
            Your Selection
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-gray-500">
            Review your food and customizations before
            checkout.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ITEMS */}

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
                          {item.category}
                        </p>

                        <h2 className="mt-1 text-lg font-black text-gray-900 sm:text-xl">
                          {item.name}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.cartItemId
                          )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* ADDONS */}

                    {item.addons.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-bold text-gray-500">
                          Extras:
                        </p>

                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {item.addons.map(
                            (addon) => (
                              <span
                                key={addon.id}
                                className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-600"
                              >
                                {addon.name}
                                {addon.price > 0 &&
                                  ` +₹${addon.price}`}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-xl bg-gray-50 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.cartItemId
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm hover:text-orange-500"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="flex min-w-10 justify-center text-sm font-black">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.cartItemId
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          ₹{item.itemTotal} ×{" "}
                          {item.quantity}
                        </p>

                        <p className="text-xl font-black text-orange-500">
                          ₹
                          {(
                            item.itemTotal *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}

          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-bold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Tax
                  </span>

                  <span className="font-bold">
                    ₹{tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black">
                      Total
                    </span>

                    <span className="text-2xl font-black text-orange-500">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-600"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/"
                className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}