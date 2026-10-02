"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Home,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Order, OrderStatus } from "@/types/order";

const statuses: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
];

const statusDetails: Record<
  OrderStatus,
  {
    title: string;
    description: string;
    icon: typeof Clock3;
  }
> = {
  Pending: {
    title: "Order Received",
    description:
      "Your order has been received and is waiting for restaurant confirmation.",
    icon: Clock3,
  },

  Accepted: {
    title: "Order Accepted",
    description:
      "The restaurant has accepted your order and will start preparing it soon.",
    icon: PackageCheck,
  },

  Preparing: {
    title: "Preparing Your Order",
    description:
      "Your food is being freshly prepared by the restaurant.",
    icon: ShoppingBag,
  },

  Completed: {
    title: "Order Completed",
    description:
      "Your order has been completed. Enjoy your delicious meal!",
    icon: CheckCircle2,
  },
};

function getStatusIndex(status: OrderStatus) {
  return statuses.indexOf(status);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/*
 * Supports both old and new orders.
 *
 * Older MongoDB orders may not have itemTotal.
 */
function getItemUnitTotal(
  item: Order["items"][number]
) {
  const basePrice = Number(item.price ?? 0);

  const addonTotal = Array.isArray(item.addons)
    ? item.addons.reduce(
        (sum, addon) =>
          sum + Number(addon.price ?? 0),
        0
      )
    : 0;

  return Number(
    item.itemTotal ?? basePrice + addonTotal
  );
}

function normalizeOrder(data: Order): Order {
  const normalizedItems = Array.isArray(data.items)
    ? data.items.map((item) => {
        const addons = Array.isArray(item.addons)
          ? item.addons
          : [];

        const itemTotal = Number(
          item.itemTotal ??
            Number(item.price ?? 0) +
              addons.reduce(
                (sum, addon) =>
                  sum + Number(addon.price ?? 0),
                0
              )
        );

        return {
          ...item,
          addons,
          price: Number(item.price ?? 0),
          quantity: Number(item.quantity ?? 1),
          itemTotal,
        };
      })
    : [];

  return {
    ...data,
    items: normalizedItems,
    subtotal: Number(data.subtotal ?? 0),
    tax: Number(data.tax ?? 0),
    total: Number(data.total ?? 0),
  };
}

export default function OrderTrackingContent() {
  const searchParams = useSearchParams();

  const urlOrderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const loadOrder = useCallback(
    async (showRefresh = false) => {
      let id = urlOrderId;

      /*
       * If orderId is not present in the URL,
       * use the last order saved in localStorage.
       */
      if (!id) {
        id = localStorage.getItem(
          "foodie-last-order"
        );
      }

      if (!id) {
        setError(
          "No order ID found. Please place an order first."
        );

        setOrder(null);
        setLoading(false);

        return;
      }

      if (showRefresh) {
        setRefreshing(true);
      }

      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(id)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Order not found."
          );
        }

        const normalizedOrder =
          normalizeOrder(data);

        setOrder(normalizedOrder);

        setError("");

        /*
         * Keep latest order available
         * for future tracking visits.
         */
        localStorage.setItem(
          "foodie-last-order",
          normalizedOrder.id
        );
      } catch (error) {
        console.error(
          "Order tracking error:",
          error
        );

        setOrder(null);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your order."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [urlOrderId]
  );

  useEffect(() => {
    loadOrder();

    /*
     * Automatically refresh every 5 seconds.
     */
    const interval = setInterval(() => {
      loadOrder();
    }, 5000);

    /*
     * Refresh when user returns to the tab.
     */
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
        loadOrder();
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
  }, [loadOrder]);

  const currentStatus: OrderStatus =
    order?.status ?? "Pending";

  const currentIndex =
    getStatusIndex(currentStatus);

  const progressPercentage = useMemo(() => {
    if (currentIndex <= 0) {
      return 0;
    }

    return (
      (currentIndex / (statuses.length - 1)) *
      100
    );
  }, [currentIndex]);

  const CurrentIcon =
    statusDetails[currentStatus].icon;

  /*
   * Loading State
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Loading your order...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your order
            details.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Order Not Found
   */
  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <ShoppingBag
                size={38}
                className="text-red-500"
              />
            </div>

            <h1 className="mt-6 text-2xl font-black text-gray-900">
              Order Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {error ||
                "We couldn't find your order."}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => loadOrder(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white transition hover:bg-orange-600"
              >
                <RefreshCw size={18} />
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3.5 font-bold text-gray-700 transition hover:bg-gray-50"
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-black text-orange-500"
          >
            <ShoppingBag size={28} />
            Foodie
          </Link>

          <button
            type="button"
            onClick={() => loadOrder(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Live Order Tracking
          </p>

          <h1 className="mt-1 text-3xl font-black text-gray-900 sm:text-4xl">
            Track Your Order
          </h1>

          <p className="mt-2 text-gray-500">
            Order ID:{" "}
            <span className="font-bold text-gray-900">
              {order.id}
            </span>
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                    <CurrentIcon
                      size={30}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-orange-500">
                      Current Status
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-gray-900">
                      {
                        statusDetails[
                          currentStatus
                        ].title
                      }
                    </h2>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
                  {currentStatus}
                </span>
              </div>

              <p className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                {
                  statusDetails[currentStatus]
                    .description
                }
              </p>

              {/* Progress */}
              <div className="mt-10">
                <div className="relative">
                  <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1 rounded-full bg-gray-200" />

                  <div
                    className="absolute left-[12.5%] top-5 h-1 rounded-full bg-orange-500 transition-all duration-700"
                    style={{
                      width: `${
                        progressPercentage * 0.75
                      }%`,
                    }}
                  />

                  <div className="relative grid grid-cols-4">
                    {statuses.map(
                      (status, index) => {
                        const Icon =
                          statusDetails[status]
                            .icon;

                        const completed =
                          index <= currentIndex;

                        const current =
                          index === currentIndex;

                        return (
                          <div
                            key={status}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                                completed
                                  ? "bg-orange-500 text-white"
                                  : "bg-gray-100 text-gray-400"
                              } ${
                                current
                                  ? "ring-4 ring-orange-100"
                                  : ""
                              }`}
                            >
                              {index <
                              currentIndex ? (
                                <Check size={17} />
                              ) : (
                                <Icon size={17} />
                              )}
                            </div>

                            <p
                              className={`mt-3 text-center text-xs font-semibold sm:text-sm ${
                                completed
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {status}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t pt-5 text-xs text-gray-400">
                <span>
                  Auto-refreshes every 5 seconds
                </span>

                <span>
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Order Items
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Items included in your order
                  </p>
                </div>

                <ShoppingBag
                  size={22}
                  className="text-orange-500"
                />
              </div>

              <div className="mt-6 space-y-4">
                {order.items.map(
                  (item, index) => {
                    const unitTotal =
                      getItemUnitTotal(item);

                    const quantity = Number(
                      item.quantity ?? 1
                    );

                    const lineTotal =
                      unitTotal * quantity;

                    return (
                      <div
                        key={`${item.menuItemId}-${index}`}
                        className="rounded-2xl bg-gray-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-gray-900">
                                {item.name}
                              </p>

                              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                                × {quantity}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                              ₹
                              {unitTotal.toFixed(
                                2
                              )}{" "}
                              per item
                            </p>

                            {item.addons?.length >
                              0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {item.addons.map(
                                  (addon) => (
                                    <span
                                      key={
                                        addon.id
                                      }
                                      className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-orange-600"
                                    >
                                      +{" "}
                                      {addon.name}

                                      {Number(
                                        addon.price ??
                                          0
                                      ) > 0 &&
                                        ` (₹${Number(
                                          addon.price
                                        ).toFixed(
                                          2
                                        )})`}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <p className="shrink-0 font-black text-gray-900">
                            ₹
                            {lineTotal.toFixed(
                              2
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                  <Truck
                    size={21}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Delivery Details
                  </h2>

                  <p className="text-sm text-gray-500">
                    Your order will be delivered to
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Customer */}
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={16} />

                    <span className="text-xs font-semibold uppercase">
                      Customer
                    </span>
                  </div>

                  <p className="mt-2 font-bold text-gray-900">
                    {order.customer.name}
                  </p>
                </div>

                {/* Mobile */}
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone size={16} />

                    <span className="text-xs font-semibold uppercase">
                      Mobile
                    </span>
                  </div>

                  <p className="mt-2 font-bold text-gray-900">
                    {order.customer.mobile}
                  </p>
                </div>

                {/* Email */}
                <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={16} />

                    <span className="text-xs font-semibold uppercase">
                      Email
                    </span>
                  </div>

                  <p className="mt-2 break-all font-bold text-gray-900">
                    {order.customer.email}
                  </p>
                </div>

                {/* Address */}
                <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />

                    <span className="text-xs font-semibold uppercase">
                      Delivery Address
                    </span>
                  </div>

                  <p className="mt-2 leading-6 font-semibold text-gray-900">
                    {order.customer.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-black text-gray-900">
                Payment Summary
              </h2>

              <div className="mt-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹
                    {Number(
                      order.subtotal ?? 0
                    ).toFixed(2)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Tax
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹
                    {Number(
                      order.tax ?? 0
                    ).toFixed(2)}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-black text-orange-500">
                      ₹
                      {Number(
                        order.total ?? 0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Order Information
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Order ID
                    </span>

                    <span className="break-all text-right font-bold text-gray-900">
                      {order.id}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Placed At
                    </span>

                    <span className="text-right font-semibold text-gray-900">
                      {formatDate(
                        order.createdAt
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Status
                    </span>

                    <span className="font-bold text-orange-500">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Updates */}
              <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                    <Truck
                      size={19}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Live Order Updates
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your order status is
                      automatically refreshed
                      every 5 seconds.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                <Home size={18} />
                Back to Home
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}