"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { Order, OrderStatus } from "@/types/order";

const statuses: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
];

const statusStyles: Record<
  OrderStatus,
  string
> = {
  Pending:
    "bg-yellow-50 text-yellow-700 border-yellow-200",
  Accepted:
    "bg-blue-50 text-blue-700 border-blue-200",
  Preparing:
    "bg-purple-50 text-purple-700 border-purple-200",
  Completed:
    "bg-green-50 text-green-700 border-green-200",
};

const statusDotStyles: Record<
  OrderStatus,
  string
> = {
  Pending: "bg-yellow-500",
  Accepted: "bg-blue-500",
  Preparing: "bg-purple-500",
  Completed: "bg-green-500",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<"All" | OrderStatus>("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/orders",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const data: Order[] =
        await response.json();

      setOrders(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const search =
      searchTerm.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === "All" ||
        order.status === selectedStatus;

      const matchesSearch =
        !search ||
        order.id
          .toLowerCase()
          .includes(search) ||
        order.customer.name
          .toLowerCase()
          .includes(search) ||
        order.customer.mobile
          .toLowerCase()
          .includes(search) ||
        order.customer.email
          .toLowerCase()
          .includes(search);

      return (
        matchesStatus && matchesSearch
      );
    });
  }, [
    orders,
    selectedStatus,
    searchTerm,
  ]);

  const statusCounts = useMemo(() => {
    return {
      All: orders.length,
      Pending: orders.filter(
        (order) => order.status === "Pending"
      ).length,
      Accepted: orders.filter(
        (order) => order.status === "Accepted"
      ).length,
      Preparing: orders.filter(
        (order) => order.status === "Preparing"
      ).length,
      Completed: orders.filter(
        (order) => order.status === "Completed"
      ).length,
    };
  }, [orders]);

  const updateStatus = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await fetch(
        `/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      setSelectedOrder((current) =>
        current?.id === orderId
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update order"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDate = (date: string) => {
    try {
      return new Date(
        date
      ).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return date;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Foodie Admin
            </p>

            <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
              Order Management
            </h1>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Loader2
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard
            title="All Orders"
            count={statusCounts.All}
            active={selectedStatus === "All"}
            onClick={() =>
              setSelectedStatus("All")
            }
          />

          <StatCard
            title="Pending"
            count={statusCounts.Pending}
            active={
              selectedStatus === "Pending"
            }
            onClick={() =>
              setSelectedStatus("Pending")
            }
          />

          <StatCard
            title="Accepted"
            count={statusCounts.Accepted}
            active={
              selectedStatus === "Accepted"
            }
            onClick={() =>
              setSelectedStatus("Accepted")
            }
          />

          <StatCard
            title="Preparing"
            count={statusCounts.Preparing}
            active={
              selectedStatus === "Preparing"
            }
            onClick={() =>
              setSelectedStatus("Preparing")
            }
          />

          <StatCard
            title="Completed"
            count={statusCounts.Completed}
            active={
              selectedStatus === "Completed"
            }
            onClick={() =>
              setSelectedStatus("Completed")
            }
          />
        </div>

        {/* SEARCH + FILTER */}
        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search order ID, customer, mobile or email..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="relative lg:w-56">
              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target.value as
                      | "All"
                      | OrderStatus
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-10 font-semibold outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="All">
                  All Statuses
                </option>

                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
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

        {/* ERROR */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <AlertCircle
              size={21}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-bold">
                Unable to load orders
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>

              <button
                onClick={fetchOrders}
                className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mt-6 space-y-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredOrders.length === 0 && (
            <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-14 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <ShoppingBag size={28} />
              </div>

              <h2 className="mt-5 text-xl font-black">
                No orders found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {searchTerm
                  ? "Try changing your search."
                  : "Orders will appear here after customers place them."}
              </p>
            </div>
          )}

        {/* ORDERS */}
        {!loading &&
          !error &&
          filteredOrders.length > 0 && (
            <div className="mt-6 space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  updating={
                    updatingOrderId === order.id
                  }
                  onView={() =>
                    setSelectedOrder(order)
                  }
                  onUpdateStatus={
                    updateStatus
                  }
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          updating={
            updatingOrderId ===
            selectedOrder.id
          }
          onClose={() =>
            setSelectedOrder(null)
          }
          onUpdateStatus={
            updateStatus
          }
          formatDate={formatDate}
        />
      )}
    </main>
  );
}

function StatCard({
  title,
  count,
  active,
  onClick,
}: {
  title: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-100"
          : "border-gray-100 bg-white hover:border-orange-200 hover:shadow-sm"
      }`}
    >
      <p
        className={`text-xs font-semibold ${
          active
            ? "text-orange-100"
            : "text-gray-400"
        }`}
      >
        {title}
      </p>

      <p className="mt-2 text-2xl font-black">
        {count}
      </p>
    </button>
  );
}

function OrderCard({
  order,
  updating,
  onView,
  onUpdateStatus,
  formatDate,
}: {
  order: Order;
  updating: boolean;
  onView: () => void;
  onUpdateStatus: (
    orderId: string,
    status: OrderStatus
  ) => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* ORDER INFO */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-black text-gray-900">
              {order.id}
            </h2>

            <StatusBadge
              status={order.status}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User size={15} />
              {order.customer.name}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={15} />
              {formatDate(
                order.createdAt
              )}
            </span>

            <span>
              {order.items.length}{" "}
              {order.items.length === 1
                ? "item"
                : "items"}
            </span>
          </div>
        </div>

        {/* TOTAL */}
        <div className="lg:text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Order Total
          </p>

          <p className="mt-1 text-2xl font-black text-orange-500">
            ₹{order.total.toFixed(2)}
          </p>
        </div>

        {/* STATUS */}
        <div className="flex flex-col gap-2 sm:flex-row lg:w-72">
          <div className="relative flex-1">
            <select
              value={order.status}
              disabled={updating}
              onChange={(event) =>
                onUpdateStatus(
                  order.id,
                  event.target.value as OrderStatus
                )
              }
              className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm font-bold outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            {updating ? (
              <Loader2
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-orange-500"
              />
            ) : (
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            )}
          </div>

          <button
            onClick={onView}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            <Eye size={16} />
            Details
          </button>
        </div>
      </div>

      {/* ITEMS PREVIEW */}
      <div className="mt-5 border-t border-gray-100 pt-5">
        <div className="flex flex-wrap gap-2">
          {order.items
            .slice(0, 4)
            .map((item) => (
              <div
                key={`${order.id}-${item.menuItemId}-${item.itemTotal}`}
                className="rounded-xl bg-gray-50 px-3 py-2"
              >
                <p className="text-xs font-bold text-gray-800">
                  {item.name} ×{" "}
                  {item.quantity}
                </p>

                {item.addons?.length > 0 && (
                  <p className="mt-1 text-[10px] text-orange-500">
                    {item.addons.length} extra
                    {item.addons.length > 1
                      ? "s"
                      : ""}
                  </p>
                )}
              </div>
            ))}

          {order.items.length > 4 && (
            <div className="flex items-center rounded-xl bg-orange-50 px-3 py-2 text-xs font-bold text-orange-500">
              +{order.items.length - 4} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`}
      />

      {status}
    </span>
  );
}

function OrderDetailsModal({
  order,
  updating,
  onClose,
  onUpdateStatus,
  formatDate,
}: {
  order: Order;
  updating: boolean;
  onClose: () => void;
  onUpdateStatus: (
    orderId: string,
    status: OrderStatus
  ) => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* MODAL HEADER */}
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Order Details
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-900 sm:text-2xl">
                {order.id}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          {/* STATUS */}
          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Current Status
                </p>

                <div className="mt-2">
                  <StatusBadge
                    status={order.status}
                  />
                </div>
              </div>

              <div className="relative sm:w-52">
                <select
                  value={order.status}
                  disabled={updating}
                  onChange={(event) =>
                    onUpdateStatus(
                      order.id,
                      event.target
                        .value as OrderStatus
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
                >
                  {statuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>

                {updating ? (
                  <Loader2
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-orange-500"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                )}
              </div>
            </div>
          </div>

          {/* CUSTOMER */}
          <section>
            <h3 className="text-lg font-black">
              Customer Information
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoBox
                icon={<User size={17} />}
                label="Name"
                value={order.customer.name}
              />

              <InfoBox
                icon={<Phone size={17} />}
                label="Mobile"
                value={order.customer.mobile}
              />

              <InfoBox
                icon={<Mail size={17} />}
                label="Email"
                value={order.customer.email}
              />

              <InfoBox
                icon={<Clock3 size={17} />}
                label="Placed At"
                value={formatDate(
                  order.createdAt
                )}
              />

              <div className="sm:col-span-2">
                <InfoBox
                  icon={<MapPin size={17} />}
                  label="Delivery Address"
                  value={order.customer.address}
                />
              </div>
            </div>
          </section>

          {/* ITEMS */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">
                Ordered Items
              </h3>

              <span className="text-sm font-semibold text-gray-400">
                {order.items.length}{" "}
                {order.items.length === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {order.items.map(
                (item, index) => (
                  <div
                    key={`${item.menuItemId}-${index}`}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-black text-gray-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{item.price} ×{" "}
                          {item.quantity}
                        </p>

                        {/* ADDONS */}
                        {item.addons?.length >
                          0 && (
                          <div className="mt-3">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                              Extras
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {item.addons.map(
                                (addon) => (
                                  <span
                                    key={addon.id}
                                    className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600"
                                  >
                                    +{" "}
                                    {
                                      addon.name
                                    }{" "}
                                    {addon.price >
                                      0 &&
                                      `(₹${addon.price})`}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="shrink-0 text-lg font-black text-gray-900">
                        ₹
                        {(
                          item.itemTotal *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* SUMMARY */}
          <section className="rounded-3xl bg-gray-900 p-5 text-white sm:p-6">
            <h3 className="text-lg font-black">
              Payment Summary
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>
                  ₹{order.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Tax (5%)</span>
                <span>
                  ₹{order.tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-700 pt-4 text-lg font-black">
                <span>Total</span>
                <span className="text-orange-400">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <Check size={18} />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-2 text-orange-500">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}