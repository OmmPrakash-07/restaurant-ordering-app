"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock3,
  Home,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[85vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-lg sm:p-10">
          {/* Success Icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
            <CheckCircle size={58} className="text-green-500" />
          </div>

          {/* Heading */}
          <h1 className="mt-7 text-3xl font-black text-gray-900 sm:text-4xl">
            Order Placed Successfully!
          </h1>

          <p className="mx-auto mt-3 max-w-lg leading-7 text-gray-500">
            Thank you for ordering from Foodie. Your order has been received and
            the restaurant will start preparing it soon.
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="mt-7 rounded-2xl bg-orange-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Your Order ID
              </p>

              <p className="mt-1 text-xl font-black text-orange-500">
                {orderId}
              </p>
            </div>
          )}

          {/* Initial Progress */}
          <div className="mt-8 grid grid-cols-4 gap-2">
            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                <Clock3 size={18} />
              </div>

              <p className="mt-2 text-xs font-semibold text-gray-700">
                Pending
              </p>
            </div>

            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <PackageCheck size={18} />
              </div>

              <p className="mt-2 text-xs text-gray-400">Accepted</p>
            </div>

            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <ShoppingBag size={18} />
              </div>

              <p className="mt-2 text-xs text-gray-400">Preparing</p>
            </div>

            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Truck size={18} />
              </div>

              <p className="mt-2 text-xs text-gray-400">Completed</p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                <MapPin size={19} className="text-orange-500" />
              </div>

              <div>
                <p className="font-bold text-gray-900">Track your order</p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  You can track your order status in real time while the
                  restaurant processes your order.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {orderId ? (
              <Link
                href={`/order-tracking?orderId=${encodeURIComponent(orderId)}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600"
              >
                Track My Order
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600"
              >
                Order Again
                <ArrowRight size={18} />
              </Link>
            )}

            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
