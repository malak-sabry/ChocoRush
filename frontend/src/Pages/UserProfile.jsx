import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../Components/Layout";
import { useCart } from "../Auth/CartContext";
import {
  MapPin,
  Truck,
  StickyNote,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const { cart, clearCart } = useCart();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resUser = await fetch("/api/users/verify", {
          credentials: "include",
        });
        if (!resUser.ok) throw new Error("Failed to fetch user data");
        const { user: loggedUser } = await resUser.json();
        setUser(loggedUser);

        const resOrders = await fetch("/api/orders", {
          credentials: "include",
        });
        if (!resOrders.ok) throw new Error("Failed to fetch orders");

        const allOrders = await resOrders.json();

        const filtered = allOrders.filter(
          (o) => o.email?.toLowerCase() === loggedUser.email?.toLowerCase()
        );
        setOrders(filtered);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleOrder = (id) =>
    setExpandedOrder((prev) => (prev === id ? null : id));

  const placeOrder = async (orderData) => {
    if (!cart?.items || cart.items.length === 0) {
      toast.error("Cart is empty, cannot place order.");
      return;
    }

    console.log("Placing order items:", cart.items); // 🔹 للتأكد

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...orderData,
          items: cart.items, // 🔹 مهم جدًا: ارسال items من الكارت
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrders((prev) => [data.order, ...prev]);

      toast.success(data.message || "Order placed successfully.");

      // مسح الكارت بعد نجاح الأوردر
      if (cart.items.length > 0) clearCart();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!user) return <p className="p-10 text-center">Failed to load profile</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-[#4a3728]">
          My Profile
        </h1>

        {/* User Info */}
        <div className="mb-10 p-6 bg-white rounded-2xl shadow-md flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[#c9b49a] flex items-center justify-center text-3xl text-white font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "role"].map((field) => (
              <div key={field}>
                <label className="text-sm font-semibold text-[#4a3728] capitalize">
                  {field}
                </label>
                <input
                  value={user?.[field] || ""}
                  disabled
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-[#c9b49a] bg-[#fdf6ef] text-[#4a3728]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-2xl font-semibold mb-4 text-[#4a3728]">
          My Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-[#8a6d5a]">You have no orders yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const isPending = order.status === "pending";

              const total =
                order.items?.reduce(
                  (sum, item) =>
                    sum + (item.price ?? 0) * (item.quantity ?? 1),
                  0
                ) ?? 0;

              return (
                <div
                  key={order._id}
                  className={`rounded-2xl shadow overflow-hidden ${isPending ? "bg-amber-50" : "bg-emerald-50"
                    }`}
                >
                  {/* Header */}
                  <div
                    className={`p-4 flex justify-between items-center cursor-pointer ${isPending ? "bg-amber-100" : "bg-emerald-100"
                      }`}
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div>
                      <p className="font-semibold text-[#4a3728]">
                        Order #{order._id?.slice(-6)?.toUpperCase() || "XXXX"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "No date"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${isPending
                            ? "bg-amber-200 text-amber-800"
                            : "bg-emerald-200 text-emerald-800"
                          }`}
                      >
                        {order.status || "unknown"}
                      </span>

                      {total > 0 && <span>${total.toFixed(2)}</span>}

                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>

                  {/* Details */}
                  {isExpanded && (
                    <div className="p-5 flex flex-col gap-5">
                      {/* Basic Info */}
                      <div className="text-sm text-[#4a3728]">
                        <p>
                          <b>Address:</b> {order.address || "N/A"}
                        </p>
                        <p>
                          <b>Delivery:</b> {order.deliveryMethod || "N/A"}
                        </p>
                        {order.notes && (
                          <p>
                            <b>Notes:</b> {order.notes}
                          </p>
                        )}
                      </div>

                      {/* Items */}
                      {order.items?.length > 0 ? (
                        <div>
                          <p className="font-semibold mb-2 flex items-center gap-2">
                            <Package size={16} /> Items
                          </p>

                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between bg-white p-3 rounded-lg mb-2"
                            >
                              <p>{item.name}</p>
                              <p>
                                {item.quantity ?? 1} × ${item.price ?? 0}
                              </p>
                            </div>
                          ))}

                          <p className="font-bold mt-2">
                            Total: ${total.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#8a6d5a] italic">
                          No items in this order
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Cart Info */}
        {cart?.items?.length > 0 && (
          <div className="mt-10 p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-[#4a3728]">
              My Cart
            </h2>
            {cart.items.map((item, idx) => (
              <div
                key={item._id ?? idx}
                className="flex items-center justify-between p-3 border-b border-[#e8d9cb]"
              >
                <p className="text-[#4a3728]">{item.name}</p>
                <p className="text-[#8a6d5a]">
                  Qty: {item.quantity} | ${item.price?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;