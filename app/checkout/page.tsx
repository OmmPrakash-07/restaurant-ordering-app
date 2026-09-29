"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

import { useCart } from "@/components/cart/CartContext";

export default function CheckoutPage() {
  const {
    cart,
    subtotal,
    tax,
    total,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    } else if (form.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setApiError("");

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setApiError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          items: cart.map((item) => ({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          tax,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      clearCart();

      window.location.href = `/order-success?orderId=${data.order.id}`;
    } catch (error) {
      console.error("Order error:", error);

      setApiError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: "",
      }));
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 py-5">
            <Link
              href="/"
              className="text-2xl font-black"
            >
              Foodie<span className="text-orange-500">.</span>
            </Link>
          </div>
        </header>

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl">🛒</div>

            <h1 className="mt-5 text-3xl font-black">
              Your cart is empty
            </h1>

            <p className="mt-2 text-gray-500">
              Add some delicious food before checkout.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
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
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-black"
          >
            Foodie<span className="text-orange-500">.</span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft size={17} />
          Back to Cart
        </Link>

        <h1 className="mt-6 text-3xl font-black">
          Checkout
        </h1>

        <p className="mt-1 text-gray-500">
          Enter your details to place your order.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Customer Form */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black">
              Delivery Details
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  value={form.mobile}
                  onChange={(e) =>
                    updateField("mobile", e.target.value)
                  }
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${
                    errors.mobile ? "border-red-500" : ""
                  }`}
                />

                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                  placeholder="example@email.com"
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Delivery Address
                </label>

                <textarea
                  value={form.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                  placeholder="House/Flat, Street, Area, City, PIN"
                  rows={4}
                  className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${
                    errors.address ? "border-red-500" : ""
                  }`}
                />

                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* API Error */}
              {apiError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {apiError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t pt-5">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Tax (5%)
                </span>

                <span className="font-semibold">
                  ₹{tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="text-lg font-black">
                  Total
                </span>

                <span className="text-lg font-black text-orange-500">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}