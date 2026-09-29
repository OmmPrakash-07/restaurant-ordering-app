"use client";

import Link from "next/link";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-8 text-center shadow-lg sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle
            size={48}
            className="text-green-500"
          />
        </div>

        <h1 className="mt-6 text-3xl font-black text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 leading-7 text-gray-500">
          Thank you for ordering from Foodie. Your order has
          been received and is being processed.
        </p>

        {orderId && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="mt-1 text-lg font-black text-orange-500">
              {orderId}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <ShoppingBag size={18} />
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}