"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
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
      <main className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-black text-orange-500"
            >
              <ShoppingBag size={28} />
              Foodie
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              <ArrowLeft size={18} />
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

            <h1 className="mt-6 text-3xl font-black text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="mt-3 leading-7 text-gray-500">
              Looks like you haven't added anything to your
              cart yet. Explore our menu and find something
              delicious!
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white transition hover:bg-orange-600"
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
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-black text-orange-500"
          >
            <ShoppingBag size={28} />
            Foodie
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-500"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Your Order
          </p>

          <h1 className="mt-1 text-3xl font-black text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-gray-500">
            {cart.reduce(
              (count, item) => count + item.quantity,
              0
            )}{" "}
            items in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wide text-orange-500">
                          {item.category}
                        </span>

                        <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
                          {item.name}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        aria-label={`Remove ${item.name}`}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>

                    <p className="mt-1 hidden text-sm leading-6 text-gray-500 sm:block">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      {/* Quantity */}
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:text-orange-500"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-8 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:text-orange-500"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          ₹{item.price} × {item.quantity}
                        </p>

                        <p className="text-lg font-black text-gray-900">
                          ₹
                          {(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-black text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Tax
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-bold text-gray-900">
                        Total
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Including 5% tax
                      </p>
                    </div>

                    <p className="text-2xl font-black text-orange-500">
                      ₹{total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-600"
              >
                Proceed to Checkout
                <ArrowRight size={19} />
              </Link>

              <Link
                href="/"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 rounded-xl bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-700">
                  🍴 Fresh food, delivered with care
                </p>
                <p className="mt-1 text-xs leading-5 text-orange-600">
                  Your order will be prepared after
                  successful checkout.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}