"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

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
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <Link href="/" className="text-2xl font-black">
              Foodie<span className="text-orange-500">.</span>
            </Link>
          </div>
        </header>

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
              <ShoppingBag size={36} className="text-orange-500" />
            </div>

            <h1 className="mt-6 text-3xl font-black">
              Your cart is empty
            </h1>

            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything yet.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              <ArrowLeft size={18} />
              Browse Menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-black">
            Foodie<span className="text-orange-500">.</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>

        <h1 className="mt-6 text-3xl font-black text-gray-900">
          Your Cart
        </h1>

        <p className="mt-1 text-gray-500">
          {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border bg-white p-4 shadow-sm"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"
                />

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-gray-900">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        ₹{item.price} each
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 transition hover:text-red-500"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={19} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-3 rounded-lg border px-2 py-1">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="w-5 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <p className="font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Tax (5%)</span>
                <span className="font-semibold">
                  ₹{tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>

                  <span className="text-lg font-black text-orange-500">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block rounded-xl bg-orange-500 px-5 py-3.5 text-center font-bold text-white transition hover:bg-orange-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}