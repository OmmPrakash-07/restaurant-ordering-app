"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  MapPin,
  ShoppingBag,
  User,
  Mail,
  Phone,
} from "lucide-react";

import { useCart } from "@/components/cart/CartContext";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  address: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

export default function CheckoutPage() {
  const { cart, subtotal, tax, total, clearCart } = useCart();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setServerError("");
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required.";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address must contain at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setServerError("Your cart is empty. Please add items before checkout.");
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          items: cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            addons: item.addons.map((addon) => ({
              id: addon.id,
            })),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      clearCart();

      localStorage.setItem("foodie-last-order", data.order.id);

      window.location.href = `/order-success?orderId=${data.order.id}`;
    } catch (error) {
      console.error("Order error:", error);

      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
              href="/cart"
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              <ArrowLeft size={18} />
              Back to Cart
            </Link>
          </div>
        </header>

        <section className="flex min-h-[75vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <ShoppingBag size={42} className="text-orange-500" />
            </div>

            <h1 className="mt-6 text-3xl font-black text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="mt-3 leading-7 text-gray-500">
              Add some delicious items to your cart before continuing to
              checkout.
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
            href="/cart"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-500"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
        </div>
      </header>

      {/* Checkout */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Almost There
          </p>

          <h1 className="mt-1 text-3xl font-black text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your details and confirm your order.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-8 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 font-semibold text-orange-500">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
              <Check size={16} />
            </span>
            Cart
          </div>

          <div className="h-px w-8 bg-orange-200 sm:w-16" />

          <div className="flex items-center gap-2 font-semibold text-orange-500">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
              2
            </span>
            Checkout
          </div>

          <div className="hidden h-px w-8 bg-gray-200 sm:block sm:w-16" />

          <div className="hidden items-center gap-2 text-gray-400 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              3
            </span>
            Confirmation
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* Left */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                  <User size={21} className="text-orange-500" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Customer Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Tell us who is placing the order.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Enter your full name"
                      className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 ${
                        errors.name
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-100"
                      }`}
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Mobile Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="mobile"
                      type="tel"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(event) =>
                        updateField(
                          "mobile",
                          event.target.value.replace(/\D/g, ""),
                        )
                      }
                      placeholder="10-digit mobile"
                      className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 ${
                        errors.mobile
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-100"
                      }`}
                    />
                  </div>

                  {errors.mobile && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 ${
                        errors.email
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-100"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Delivery Address
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />

                    <textarea
                      id="address"
                      rows={4}
                      value={formData.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      placeholder="House/Flat number, street, city, state..."
                      className={`w-full resize-none rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 ${
                        errors.address
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-100"
                      }`}
                    />
                  </div>

                  {errors.address && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                  <CreditCard size={21} className="text-orange-500" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Payment Method
                  </h2>
                  <p className="text-sm text-gray-500">
                    Payment is simulated for this project.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl border-2 border-orange-500 bg-orange-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                    <CreditCard size={20} className="text-orange-500" />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">
                      Cash / Demo Payment
                    </p>
                    <p className="text-xs text-gray-500">
                      No real payment will be processed.
                    </p>
                  </div>
                </div>

                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                  <Check size={14} className="text-white" />
                </div>
              </div>
            </div>

            {/* Error */}
            {serverError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-600">
                  {serverError}
                </p>
              </div>
            )}
          </div>

          {/* Right */}
          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-black text-gray-900">
                Order Summary
              </h2>

              {/* Items */}
              <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        ₹{item.itemTotal} × {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-gray-900">
                      {(item.itemTotal * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t" />

              {/* Totals */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>

                  <span className="font-semibold text-gray-900">
                    ₹{tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Total</p>
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

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

              {/* Security */}
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                <Lock size={17} className="mt-0.5 shrink-0 text-green-500" />

                <p className="text-xs leading-5 text-gray-500">
                  Your information is securely submitted to the restaurant order
                  system.
                </p>
              </div>

              <Link
                href="/cart"
                className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
              >
                <ArrowLeft size={16} />
                Return to Cart
              </Link>
            </div>
          </aside>
        </form>
      </section>
    </main>
  );
}
