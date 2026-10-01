import { Suspense } from "react";

import OrderSuccessContent from "./OrderSuccessContent";

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

        <p className="mt-4 text-sm text-gray-500">
          Loading order details...
        </p>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrderSuccessContent />
    </Suspense>
  );
}