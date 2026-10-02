"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  DollarSign,
  Eye,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Package,
  Phone,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  TrendingUp,
  User,
  Users,
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
  {
    badge: string;
    dot: string;
    text: string;
  }
> = {
  Pending: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    text: "Waiting for restaurant confirmation",
  },
  Accepted: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    text: "Order accepted by restaurant",
  },
  Preparing: {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    text: "Food is being prepared",
  },
  Completed: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    text: "Order completed successfully",
  },
};

function getOrderTotal(order: Order) {
  return order.total ?? 0;
}

function getItemUnitPrice(item: Order["items"][number]) {
  return item.itemTotal ?? item.price ?? 0;
}

function getItemTotal(item: Order["items"][number]) {
  return getItemUnitPrice(item) * (item.quantity ?? 0);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<"All" | OrderStatus>("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders",
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid order data received.");
      }

      setOrders(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load orders",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === "All" ||
        order.status === selectedStatus;

      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search) ||
        order.customer?.name
          ?.toLowerCase()
          .includes(search) ||
        order.customer?.mobile
          ?.toLowerCase()
          .includes(search) ||
        order.customer?.email
          ?.toLowerCase()
          .includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [orders, selectedStatus, searchTerm]);

  const statistics = useMemo(() => {
    const revenue = orders.reduce(
      (sum, order) => sum + getOrderTotal(order),
      0,
    );

    const completedRevenue = orders
      .filter((order) => order.status === "Completed")
      .reduce(
        (sum, order) => sum + getOrderTotal(order),
        0,
      );

    const activeOrders = orders.filter(
      (order) =>
        order.status === "Accepted" ||
        order.status === "Preparing",
    ).length;

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending",
    ).length;

    const completedOrders = orders.filter(
      (order) => order.status === "Completed",
    ).length;

    return {
      revenue,
      completedRevenue,
      activeOrders,
      pendingOrders,
      completedOrders,
      totalOrders: orders.length,
    };
  }, [orders]);

  const statusCounts = useMemo(() => {
    return {
      Pending: orders.filter(
        (order) => order.status === "Pending",
      ).length,
      Accepted: orders.filter(
        (order) => order.status === "Accepted",
      ).length,
      Preparing: orders.filter(
        (order) => order.status === "Preparing",
      ).length,
      Completed: orders.filter(
        (order) => order.status === "Completed",
      ).length,
    };
  }, [orders]);

  const averageOrderValue =
    statistics.totalOrders > 0
      ? statistics.revenue / statistics.totalOrders
      : 0;

  const updateStatus = async (
    orderId: string,
    status: OrderStatus,
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await fetch(
        `/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status",
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order,
        ),
      );

      setSelectedOrder((current) =>
        current?.id === orderId
          ? { ...current, status }
          : current,
      );
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update order",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return date;
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-gray-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#111318] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/20">
                <ShoppingBag size={21} />
              </div>

              <div>
                <p className="text-lg font-black tracking-tight">
                  Foodie
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Admin Panel
                </p>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Workspace
            </p>

            <div className="space-y-1">
              <SidebarItem
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                active
              />

              <Link
                href="/order-history"
                onClick={() => setSidebarOpen(false)}
              >
                <SidebarItem
                  icon={<Package size={18} />}
                  label="Customer Orders"
                />
              </Link>

              <SidebarItem
                icon={<Users size={18} />}
                label="Customers"
                disabled
              />

              <SidebarItem
                icon={<BarChart3 size={18} />}
                label="Analytics"
                disabled
              />
            </div>

            <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Management
            </p>

            <div className="space-y-1">
              <SidebarItem
                icon={<ShoppingBag size={18} />}
                label="Orders"
                active
              />

              <SidebarItem
                icon={<Settings size={18} />}
                label="Settings"
                disabled
              />
            </div>
          </nav>

          {/* Restaurant Status */}
          <div className="m-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>

              <div>
                <p className="text-xs font-bold text-white">
                  Restaurant Online
                </p>

                <p className="mt-0.5 text-[10px] text-gray-500">
                  Accepting orders
                </p>
              </div>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-black">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  Restaurant Admin
                </p>

                <p className="truncate text-xs text-gray-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:pl-72">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="hidden h-2 w-2 rounded-full bg-orange-500 sm:block" />

                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Restaurant Management
                  </p>
                </div>

                <h1 className="mt-0.5 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-200 hover:text-orange-500"
                title="Notifications"
              >
                <Bell size={18} />

                {statistics.pendingOrders > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
                )}
              </button>

              <button
                onClick={() => fetchOrders(true)}
                disabled={refreshing}
                className="flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-60 sm:px-4"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* WELCOME */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-orange-500">
                Good day, Admin 👋
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                Here's your restaurant overview.
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Monitor orders, revenue and restaurant activity
                from one place.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-bold text-emerald-700">
                Live System
              </span>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Total Revenue"
              value={`₹${statistics.revenue.toFixed(2)}`}
              description={`₹${statistics.completedRevenue.toFixed(
                2,
              )} completed`}
              icon={<DollarSign size={21} />}
              trend="All orders"
              iconClass="bg-orange-50 text-orange-500"
            />

            <KpiCard
              label="Total Orders"
              value={statistics.totalOrders.toString()}
              description={`${statistics.completedOrders} completed`}
              icon={<ShoppingBag size={21} />}
              trend="All time"
              iconClass="bg-blue-50 text-blue-500"
            />

            <KpiCard
              label="Active Orders"
              value={statistics.activeOrders.toString()}
              description={`${statistics.pendingOrders} waiting`}
              icon={<TrendingUp size={21} />}
              trend="Live"
              iconClass="bg-purple-50 text-purple-500"
            />

            <KpiCard
              label="Avg. Order Value"
              value={`₹${averageOrderValue.toFixed(2)}`}
              description="Across all orders"
              icon={<BarChart3 size={21} />}
              trend="Average"
              iconClass="bg-emerald-50 text-emerald-500"
            />
          </div>

          {/* ANALYTICS ROW */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* ORDER OVERVIEW */}
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Order Overview
                  </p>

                  <h3 className="mt-1 text-xl font-black text-gray-900">
                    Order distribution
                  </h3>
                </div>

                <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500">
                  <BarChart3 size={19} />
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <StatusProgress
                  label="Pending"
                  count={statusCounts.Pending}
                  total={statistics.totalOrders}
                  color="bg-amber-500"
                  dot="bg-amber-500"
                />

                <StatusProgress
                  label="Accepted"
                  count={statusCounts.Accepted}
                  total={statistics.totalOrders}
                  color="bg-blue-500"
                  dot="bg-blue-500"
                />

                <StatusProgress
                  label="Preparing"
                  count={statusCounts.Preparing}
                  total={statistics.totalOrders}
                  color="bg-purple-500"
                  dot="bg-purple-500"
                />

                <StatusProgress
                  label="Completed"
                  count={statusCounts.Completed}
                  total={statistics.totalOrders}
                  color="bg-emerald-500"
                  dot="bg-emerald-500"
                />
              </div>
            </section>

            {/* QUICK STATUS */}
            <section className="rounded-3xl bg-gray-900 p-5 text-white shadow-xl shadow-gray-200 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Live Operations
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    Kitchen Status
                  </h3>
                </div>

                <span className="rounded-xl bg-white/10 p-2.5 text-orange-400">
                  <Clock3 size={19} />
                </span>
              </div>

              <div className="mt-7 space-y-3">
                <QuickStatus
                  label="Pending Orders"
                  value={statistics.pendingOrders}
                  status="Waiting"
                  dot="bg-amber-400"
                />

                <QuickStatus
                  label="Accepted Orders"
                  value={statusCounts.Accepted}
                  status="Accepted"
                  dot="bg-blue-400"
                />

                <QuickStatus
                  label="Preparing Orders"
                  value={statusCounts.Preparing}
                  status="In Kitchen"
                  dot="bg-purple-400"
                />

                <QuickStatus
                  label="Completed Orders"
                  value={statistics.completedOrders}
                  status="Done"
                  dot="bg-emerald-400"
                />
              </div>
            </section>
          </div>

          {/* FILTER SECTION */}
          <section className="mt-6 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search order ID, customer, phone or email..."
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                  />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                <FilterButton
                  label="All"
                  count={orders.length}
                  active={selectedStatus === "All"}
                  onClick={() =>
                    setSelectedStatus("All")
                  }
                />

                {statuses.map((status) => (
                  <FilterButton
                    key={status}
                    label={status}
                    count={statusCounts[status]}
                    active={selectedStatus === status}
                    onClick={() =>
                      setSelectedStatus(status)
                    }
                  />
                ))}
              </div>
            </div>
          </section>

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
                  onClick={() => fetchOrders()}
                  className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white">
              <div className="space-y-0">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="animate-pulse border-b border-gray-100 p-5 last:border-0"
                    >
                      <div className="flex gap-4">
                        <div className="h-11 w-11 rounded-xl bg-gray-100" />

                        <div className="flex-1 space-y-3">
                          <div className="h-4 w-40 rounded bg-gray-100" />
                          <div className="h-3 w-64 rounded bg-gray-100" />
                        </div>

                        <div className="h-8 w-24 rounded-lg bg-gray-100" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            filteredOrders.length === 0 && (
              <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-14 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <ShoppingBag size={32} />
                </div>

                <h2 className="mt-5 text-xl font-black">
                  No orders found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  {searchTerm
                    ? "Try changing your search or clearing the filter."
                    : "Orders will appear here after customers place them."}
                </p>

                {(searchTerm ||
                  selectedStatus !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedStatus("All");
                    }}
                    className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

          {/* ORDERS TABLE */}
          {!loading &&
            !error &&
            filteredOrders.length > 0 && (
              <section className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                {/* Table Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      Recent Orders
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Showing {filteredOrders.length}{" "}
                      {filteredOrders.length === 1
                        ? "order"
                        : "orders"}
                    </p>
                  </div>

                  <div className="hidden rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 sm:block">
                    Live Data
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Order
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Items
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Amount
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <AdminOrderRow
                          key={order.id}
                          order={order}
                          updating={
                            updatingOrderId ===
                            order.id
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
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="divide-y divide-gray-100 md:hidden">
                  {filteredOrders.map((order) => (
                    <MobileOrderCard
                      key={order.id}
                      order={order}
                      updating={
                        updatingOrderId ===
                        order.id
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
              </section>
            )}
        </div>
      </div>

      {/* DETAILS MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          updating={
            updatingOrderId === selectedOrder.id
          }
          onClose={() =>
            setSelectedOrder(null)
          }
          onUpdateStatus={updateStatus}
          formatDate={formatDate}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------
   SIDEBAR
------------------------------------------------------- */

function SidebarItem({
  icon,
  label,
  active = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
        active
          ? "bg-orange-500 text-white shadow-lg shadow-orange-900/20"
          : disabled
            ? "cursor-not-allowed text-gray-600"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}

      <span>{label}</span>

      {disabled && (
        <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-gray-600">
          Soon
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   KPI
------------------------------------------------------- */

function KpiCard({
  label,
  value,
  description,
  icon,
  trend,
  iconClass,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
  iconClass: string;
}) {
  return (
    <div className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-400">
          {trend}
        </span>
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-xs font-medium text-gray-400">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------
   STATUS PROGRESS
------------------------------------------------------- */

function StatusProgress({
  label,
  count,
  total,
  color,
  dot,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  dot: string;
}) {
  const percentage =
    total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${dot}`}
          />

          <span className="text-sm font-bold text-gray-700">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-900">
            {count}
          </span>

          <span className="text-xs text-gray-400">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   QUICK STATUS
------------------------------------------------------- */

function QuickStatus({
  label,
  value,
  status,
  dot,
}: {
  label: string;
  value: number;
  status: string;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dot}`}
        />

        <div>
          <p className="text-sm font-bold">
            {label}
          </p>

          <p className="mt-0.5 text-[11px] text-gray-500">
            {status}
          </p>
        </div>
      </div>

      <span className="text-xl font-black">
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------
   FILTER BUTTON
------------------------------------------------------- */

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
        active
          ? "bg-gray-900 text-white shadow-md"
          : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          active
            ? "bg-white/10 text-white"
            : "bg-white text-gray-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* -------------------------------------------------------
   DESKTOP ORDER ROW
------------------------------------------------------- */

function AdminOrderRow({
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
    status: OrderStatus,
  ) => void;
  formatDate: (date: string) => string;
}) {
  const total = getOrderTotal(order);

  return (
    <tr className="group transition hover:bg-gray-50/70">
      {/* Order */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <Package size={18} />
          </div>

          <div>
            <p className="text-sm font-black text-gray-900">
              {order.id}
            </p>

            <p className="mt-0.5 text-[11px] text-gray-400">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </td>

      {/* Customer */}
      <td className="px-6 py-5">
        <div>
          <p className="text-sm font-bold text-gray-800">
            {order.customer?.name ?? "Unknown"}
          </p>

          <p className="mt-0.5 text-xs text-gray-400">
            {order.customer?.mobile ?? "No phone"}
          </p>
        </div>
      </td>

      {/* Items */}
      <td className="px-6 py-5">
        <div className="max-w-48">
          <p className="truncate text-sm font-semibold text-gray-700">
            {order.items
              .slice(0, 2)
              .map((item) => item.name)
              .join(", ")}
          </p>

          {order.items.length > 2 && (
            <p className="mt-1 text-[11px] text-gray-400">
              +{order.items.length - 2} more
            </p>
          )}
        </div>
      </td>

      {/* Amount */}
      <td className="px-6 py-5">
        <p className="text-sm font-black text-gray-900">
          ₹{total.toFixed(2)}
        </p>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <div className="relative w-36">
          <select
            value={order.status}
            disabled={updating}
            onChange={(event) =>
              onUpdateStatus(
                order.id,
                event.target.value as OrderStatus,
              )
            }
            className={`h-9 w-full appearance-none rounded-lg border px-3 pr-8 text-xs font-bold outline-none transition disabled:opacity-60 ${statusStyles[order.status].badge}`}
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
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin"
            />
          ) : (
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            />
          )}
        </div>
      </td>

      {/* Action */}
      <td className="px-6 py-5 text-right">
        <button
          onClick={onView}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition hover:border-orange-300 hover:text-orange-500"
        >
          <Eye size={14} />
          View
        </button>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------
   MOBILE ORDER CARD
------------------------------------------------------- */

function MobileOrderCard({
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
    status: OrderStatus,
  ) => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <Package size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-gray-900">
              {order.id}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <p className="shrink-0 text-lg font-black text-orange-500">
          ₹{getOrderTotal(order).toFixed(2)}
        </p>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        <p className="text-xs font-bold text-gray-800">
          {order.customer?.name ?? "Unknown customer"}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {order.items
            .map((item) => `${item.name} × ${item.quantity}`)
            .join(", ")}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <select
            value={order.status}
            disabled={updating}
            onChange={(event) =>
              onUpdateStatus(
                order.id,
                event.target.value as OrderStatus,
              )
            }
            className={`h-10 w-full appearance-none rounded-xl border px-3 pr-8 text-xs font-bold outline-none ${statusStyles[order.status].badge}`}
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

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>

        <button
          onClick={onView}
          className="flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-xs font-bold text-white"
        >
          <Eye size={15} />
          View
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   DETAILS MODAL
------------------------------------------------------- */

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
    status: OrderStatus,
  ) => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-5 py-5 backdrop-blur sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
                Order Details
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-900 sm:text-2xl">
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
        </div>

        <div className="space-y-7 p-5 sm:p-7">
          {/* Status */}
          <div className="rounded-2xl bg-gray-900 p-5 text-white">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Current Order Status
                </p>

                <div className="mt-2">
                  <StatusBadge status={order.status} />
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
                        .value as OrderStatus,
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/10 px-3 pr-9 text-sm font-bold text-white outline-none focus:border-orange-400 disabled:opacity-60"
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="text-gray-900"
                    >
                      {status}
                    </option>
                  ))}
                </select>

                {updating ? (
                  <Loader2
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-orange-400"
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

          {/* Customer */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">
                Customer Information
              </h3>

              <User
                size={19}
                className="text-gray-300"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoBox
                icon={<User size={17} />}
                label="Name"
                value={
                  order.customer?.name ??
                  "Not available"
                }
              />

              <InfoBox
                icon={<Phone size={17} />}
                label="Mobile"
                value={
                  order.customer?.mobile ??
                  "Not available"
                }
              />

              <InfoBox
                icon={<Mail size={17} />}
                label="Email"
                value={
                  order.customer?.email ??
                  "Not available"
                }
              />

              <InfoBox
                icon={<Clock3 size={17} />}
                label="Placed At"
                value={formatDate(
                  order.createdAt,
                )}
              />

              <div className="sm:col-span-2">
                <InfoBox
                  icon={<MapPin size={17} />}
                  label="Delivery Address"
                  value={
                    order.customer?.address ??
                    "Not available"
                  }
                />
              </div>
            </div>
          </section>

          {/* Items */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">
                Ordered Items
              </h3>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                {order.items.length}{" "}
                {order.items.length === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {order.items.map(
                (item, index) => {
                  const itemUnitPrice =
                    getItemUnitPrice(item);

                  const itemTotal =
                    getItemTotal(item);

                  return (
                    <div
                      key={`${item.menuItemId}-${index}`}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-black text-gray-900">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ₹
                            {itemUnitPrice.toFixed(
                              2,
                            )}{" "}
                            × {item.quantity}
                          </p>

                          {item.addons?.length >
                            0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.addons.map(
                                (addon) => (
                                  <span
                                    key={addon.id}
                                    className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600"
                                  >
                                    +{" "}
                                    {addon.name}
                                    {addon.price >
                                      0 &&
                                      ` (₹${addon.price})`}
                                  </span>
                                ),
                              )}
                            </div>
                          )}
                        </div>

                        <p className="shrink-0 text-base font-black text-gray-900">
                          ₹
                          {itemTotal.toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-3xl bg-gray-900 p-5 text-white sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">
                Payment Summary
              </h3>

              <DollarSign
                size={20}
                className="text-orange-400"
              />
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>

                <span>
                  ₹{(order.subtotal ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Tax (5%)</span>

                <span>
                  ₹{(order.tax ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-black">
                <span>Total</span>

                <span className="text-orange-400">
                  ₹{getOrderTotal(order).toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <Check size={18} />
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   STATUS BADGE
------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const style = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${style.badge}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
      />

      {status}
    </span>
  );
}

/* -------------------------------------------------------
   INFO BOX
------------------------------------------------------- */

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
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-orange-500">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}