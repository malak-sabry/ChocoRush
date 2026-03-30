import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const STATUS_COLORS = {
  pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
    dot: "bg-amber-400",
    label: "Pending",
  },
  confirmed: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
    dot: "bg-emerald-400",
    label: "Confirmed",
  },
};

const FILTERS = ["all", "pending", "confirmed"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionId, setActionId] = useState(null); 

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmOrder = async (id) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/orders/${id}/confirm`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "confirmed" } : o))
      );
      toast.success("Order confirmed!");
    } catch {
      toast.error("Failed to confirm order.");
    } finally {
      setActionId(null);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success("Order deleted.");
    } catch {
      toast.error("Failed to delete order.");
    } finally {
      setActionId(null);
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
  };

  return (
      <section className="min-h-screen px-4 py-10 bg-[#fdf6ef]">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#4a3728]">Orders</h1>
            <p className="text-[#8a6d5a] text-sm mt-1">
              Manage and track all customer orders
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition duration-200 capitalize
                  ${
                    filter === f
                      ? "bg-[#4a3728] text-[#FCF0E6] border-[#4a3728]"
                      : "bg-white text-[#4a3728] border-[#c9b49a] hover:border-[#4a3728]"
                  }`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}{" "}
                <span className="ml-1 opacity-70">({counts[f]})</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-8 h-8 border-4 border-[#c9b49a] border-t-[#4a3728] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-[#a08878]">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-lg font-semibold">No orders found</p>
              <p className="text-sm mt-1">
                {filter !== "all"
                  ? `No ${filter} orders at the moment.`
                  : "Orders will appear here once customers place them."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((order) => {
                const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                const isActing = actionId === order._id;

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-[#e8d9cc] shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition hover:shadow-md"
                  >
                    {/* Info */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-bold text-[#4a3728] text-base">
                          {order.name}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>

                      <p className="text-sm text-[#8a6d5a]">{order.email}</p>
                      <p className="text-sm text-[#8a6d5a]">{order.phone}</p>
                      <p className="text-sm text-[#8a6d5a] mt-0.5 line-clamp-2">
                        📍 {order.address}
                      </p>
                      <p className="text-xs text-[#c0a88e] mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {order.status === "pending" && (
                        <button
                          onClick={() => confirmOrder(order._id)}
                          disabled={isActing}
                          className="px-4 py-2 rounded-xl bg-[#4a3728] text-[#FCF0E6] text-sm font-semibold
                            hover:bg-[#3a2a1e] active:scale-95 transition duration-200 disabled:opacity-50"
                        >
                          {isActing ? "..." : "✓ Confirm"}
                        </button>
                      )}
                      <button
                        onClick={() => deleteOrder(order._id)}
                        disabled={isActing}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-semibold
                          hover:bg-red-100 active:scale-95 transition duration-200 disabled:opacity-50"
                      >
                        {isActing ? "..." : "✕ Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
  );
};

export default Orders;