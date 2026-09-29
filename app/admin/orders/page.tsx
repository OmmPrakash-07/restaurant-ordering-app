"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";

import { Order, OrderStatus } from "@/types/order";

const statuses: Array<"All" | OrderStatus> = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
];

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-50 text-yellow-700",
  Accepted: "bg-blue-50 text-blue-700",
  Preparing: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Orders error:", error);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = useMemo(() => {
    if (filter === "All") {
      return orders;
    }

    return orders.filter(
      (order) => order.status === filter
    );
  }, [orders, filter]);

  async function changeStatus(
    orderId: string,
    status: OrderStatus
  ) {
    try {
      const response = await fetch(
        `/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update order status.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Foodie Admin
            </p>

            <h1 className="text-2xl font-black text-gray-900">
              Orders
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Menu
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={orders.length}
          />

          <StatCard
            title="Pending"
            value={
              orders.filter(
                (order) => order.status === "Pending"
              ).length
            }
          />

          <StatCard
            title="Preparing"
            value={
              orders.filter(
                (order) => order.status === "Preparing"
              ).length
            }
          />

          <StatCard
            title="Completed"
            value={
              orders.filter(
                (order) => order.status === "Completed"
              ).length
            }
          />
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-bold text-gray-700">
            Filter Orders
          </p>

          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => {
              const count =
                status === "All"
                  ? orders.length
                  : orders.filter(
                      (order) =>
                        order.status === status
                    ).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    console.log(
                      "Selected filter:",
                      status
                    );
                    setFilter(status);
                  }}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    filter === status
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50"
                  }`}
                >
                  {status}

                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      filter === status
                        ? "bg-white/20"
                        : "bg-white"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current filter */}
        {!loading && (
          <div className="mt-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">
                {filter === "All"
                  ? "All Orders"
                  : `${filter} Orders`}
              </h2>

              <p className="text-sm text-gray-500">
                Showing {filteredOrders.length} order
                {filteredOrders.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

            <p className="mt-4 text-gray-500">
              Loading orders...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredOrders.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed bg-white py-20 text-center">
            <ShoppingBag
              size={48}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-xl font-black">
              No {filter === "All" ? "" : filter} orders
              found
            </h2>

            <p className="mt-2 text-gray-500">
              Try another status filter.
            </p>
          </div>
        )}

        {/* Orders */}
        {!loading && filteredOrders.length > 0 && (
          <div className="mt-6 space-y-5">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={changeStatus}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-gray-900">
        {value}
      </p>
    </div>
  );
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (
    orderId: string,
    status: OrderStatus
  ) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Order Header */}
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Order
          </p>

          <h2 className="mt-1 font-black text-gray-900">
            #{order.id}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={order.status}
            onChange={(event) =>
              onStatusChange(
                order.id,
                event.target.value as OrderStatus
              )
            }
            className={`appearance-none rounded-full border-0 py-2 pl-4 pr-10 text-sm font-bold outline-none ${
              statusStyles[order.status]
            }`}
          >
            {statuses
              .filter(
                (status): status is OrderStatus =>
                  status !== "All"
              )
              .map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      {/* Order Content */}
      <div className="grid gap-6 p-5 lg:grid-cols-3">
        {/* Customer */}
        <div>
          <h3 className="font-bold text-gray-900">
            Customer
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            <p className="font-semibold">
              {order.customer.name}
            </p>

            <p className="flex gap-2 text-gray-500">
              <Phone size={16} />
              {order.customer.mobile}
            </p>

            <p className="flex gap-2 break-all text-gray-500">
              <Mail size={16} />
              {order.customer.email}
            </p>

            <p className="flex gap-2 text-gray-500">
              <MapPin size={16} />
              {order.customer.address}
            </p>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="font-bold text-gray-900">
            Items
          </h3>

          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex justify-between gap-3 text-sm"
              >
                <div>
                  <span className="font-semibold">
                    {item.name}
                  </span>

                  <span className="ml-2 text-gray-400">
                    × {item.quantity}
                  </span>
                </div>

                <span className="font-semibold">
                  ₹
                  {(
                    item.price * item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="font-bold">
            Payment Summary
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span>
                ₹{order.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Tax
              </span>

              <span>
                ₹{order.tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="font-bold">
                Total
              </span>

              <span className="text-lg font-black text-orange-500">
                ₹{order.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Clock size={14} />
            Order received
          </div>
        </div>
      </div>
    </div>
  );
}