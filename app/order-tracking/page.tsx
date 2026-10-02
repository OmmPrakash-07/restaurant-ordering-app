import { Suspense } from "react";

import OrderTrackingContent from "./OrderTrackingContent";

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

        <h1 className="mt-5 text-xl font-bold text-gray-900">
          Loading order tracking...
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Please wait while we fetch your order details.
        </p>
      </div>
    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrderTrackingContent />
    </Suspense>
  );
}