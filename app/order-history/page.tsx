"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock,
  Eye,
  History,
  Loader2,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { Order, OrderStatus } from "@/types/order";

const statuses: Array<"All" | OrderStatus> = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
];

const statusStyles: Record<
  OrderStatus,
  {
    badge: string;
    dot: string;
    text: string;
  }
> = {
  Pending: {
    badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
    text: "Waiting for restaurant confirmation",
  },
  Accepted: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    text: "Order accepted by restaurant",
  },
  Preparing: {
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    text: "Your food is being prepared",
  },
  Completed: {
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    text: "Order completed",
  },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [status, setStatus] = useState<"All" | OrderStatus>("All");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const params = new URLSearchParams();

      if (status !== "All") {
        params.set("status", status);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const query = params.toString();

      const response = await fetch(`/api/orders${query ? `?${query}` : ""}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders.");
      }

      setOrders(data);
    } catch (error) {
      console.error("Order history error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load order history.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [status, search]);

  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      active: orders.filter(
        (order) => order.status === "Accepted" || order.status === "Preparing",
      ).length,
      completed: orders.filter((order) => order.status === "Completed").length,
    };
  }, [orders]);

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
            Back to Menu
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-orange-500">
              <History size={20} />

              <p className="text-sm font-bold uppercase tracking-wider">
                Your Orders
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
              Order History
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              View your previous orders, check their status, and track your
              active orders.
            </p>
          </div>

          <button
            onClick={() => loadOrders(false)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-orange-300 hover:text-orange-500 disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={orderStats.total}
            icon={<Package size={20} />}
          />

          <StatCard
            label="Pending"
            value={orderStats.pending}
            icon={<Clock size={20} />}
          />

          <StatCard
            label="Active"
            value={orderStats.active}
            icon={<RefreshCw size={20} />}
          />

          <StatCard
            label="Completed"
            value={orderStats.completed}
            icon={<ShoppingBag size={20} />}
          />
        </div>

        {/* Search & Filter */}
        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order ID, name, email or mobile..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Status */}
            <div className="relative lg:w-56">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "All" | OrderStatus)
                }
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Orders" : item}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-600">{error}</p>

            <button
              onClick={() => loadOrders()}
              className="mt-3 text-sm font-bold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 flex min-h-64 items-center justify-center rounded-3xl border border-gray-100 bg-white">
            <div className="text-center">
              <Loader2
                size={36}
                className="mx-auto animate-spin text-orange-500"
              />

              <p className="mt-4 text-sm font-semibold text-gray-500">
                Loading your orders...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="mt-8 rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <Package size={42} className="text-orange-500" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-900">
              No Orders Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {search || status !== "All"
                ? "No orders match your current search or filter."
                : "You haven't placed any orders yet."}
            </p>

            {(search || status !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("All");
                }}
                className="mt-6 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
              >
                Clear Filters
              </button>
            )}

            {!search && status === "All" && (
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white transition hover:bg-orange-600"
              >
                Browse Menu
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          {icon}
        </div>

        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>

      <p className="mt-4 text-sm font-semibold text-gray-500">{label}</p>
    </div>
  );
}

function OrderCard({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails: () => void;
}) {
  const status = statusStyles[order.status];

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = order.status !== "Completed";

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      {/* Top */}
      <div className="border-b border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-lg font-black text-gray-900">{order.id}</p>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${status.badge}`}
              >
                <span className={`h-2 w-2 rounded-full ${status.dot}`} />

                {order.status}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} />
                {formatDate(order.createdAt)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} />
                {formatTime(order.createdAt)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ShoppingBag size={15} />
                {totalItems} item
                {totalItems !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total
            </p>

            <p className="mt-1 text-2xl font-black text-orange-500">
              ₹{order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-5 sm:p-6">
        <div className="space-y-3">
          {order.items.slice(0, 3).map((item) => (
            <div
              key={`${order.id}-${item.menuItemId}-${item.name}`}
              className="flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  ₹{item.itemTotal.toFixed(2)} × {item.quantity}
                </p>

                {item.addons?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.addons.map((addon) => (
                      <span
                        key={`${item.menuItemId}-${addon.id}`}
                        className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600"
                      >
                        + {addon.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="shrink-0 text-sm font-bold text-gray-900">
                ₹{(item.itemTotal * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          {order.items.length > 3 && (
            <p className="pt-1 text-xs font-semibold text-gray-400">
              + {order.items.length - 3} more item
              {order.items.length - 3 !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Status text */}
        <div className="mt-5 rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-500">{status.text}</p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onViewDetails}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
          >
            <Eye size={17} />
            View Details
          </button>

          {isActive && (
            <Link
              href={`/order-tracking?orderId=${encodeURIComponent(order.id)}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <MapPin size={17} />
              Track Order
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
          >
            <RefreshCw size={17} />
            Reorder
          </Link>
        </div>
      </div>
    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const status = statusStyles[order.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Order Details
            </p>

            <h2 className="mt-1 text-xl font-black text-gray-900">
              {order.id}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Status */}
          <div className={`rounded-2xl border p-4 ${status.badge}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold opacity-70">
                  Current Status
                </p>

                <p className="mt-1 font-black">{order.status}</p>
              </div>

              <span className={`h-3 w-3 rounded-full ${status.dot}`} />
            </div>

            <p className="mt-2 text-xs font-medium opacity-80">{status.text}</p>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Delivery Details
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={<User size={17} />}
                label="Name"
                value={order.customer.name}
              />

              <InfoRow
                icon={<Phone size={17} />}
                label="Mobile"
                value={order.customer.mobile}
              />

              <InfoRow
                icon={<MapPin size={17} />}
                label="Address"
                value={order.customer.address}
                full
              />

              <InfoRow
                icon={<CalendarDays size={17} />}
                label="Ordered On"
                value={`${formatDate(order.createdAt)} at ${formatTime(
                  order.createdAt,
                )}`}
                full
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-black text-gray-900">Items</h3>

            <div className="mt-4 divide-y rounded-2xl border border-gray-100">
              {order.items.map((item) => (
                <div key={`${item.menuItemId}-${item.name}`} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>

                      <p className="mt-1 text-xs text-gray-400">
                        ₹{(item.itemTotal ?? item.price ?? 0).toFixed(2)} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="font-black text-gray-900">
                      ₹{(item.itemTotal * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {item.addons?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.addons.map((addon) => (
                        <span
                          key={addon.id}
                          className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600"
                        >
                          {addon.name} +₹
                          {addon.price}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Payment Summary
            </h3>

            <div className="mt-4 space-y-3 rounded-2xl bg-gray-50 p-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>

                <span className="font-semibold text-gray-900">
                  ₹{(order.subtotal ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>

                <span className="font-semibold text-gray-900">
                  ₹{(order.tax ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>

                  <span className="text-xl font-black text-orange-500">
                    ₹{(order.total ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status !== "Completed" && (
            <Link
              href={`/order-tracking?orderId=${encodeURIComponent(order.id)}`}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600"
            >
              <MapPin size={18} />
              Track This Order
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  full = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={`rounded-xl bg-gray-50 p-4 ${full ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-2 text-gray-400">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
