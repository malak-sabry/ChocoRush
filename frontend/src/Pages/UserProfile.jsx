import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../Components/Layout";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resUser = await fetch("http://localhost:5000/users/verify", {
          credentials: "include",
        });
        if (!resUser.ok) throw new Error("Failed to fetch user data");
        const { user: loggedUser } = await resUser.json();
        setUser(loggedUser);

        const resOrders = await fetch(`http://localhost:5000/orders`, {
          credentials: "include",
        });
        if (!resOrders.ok) throw new Error("Failed to fetch orders");
        const allOrders = await resOrders.json();
        setOrders(allOrders.filter(o => o.email === loggedUser.email));
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-[#4a3728]">My Profile</h1>

        {/* User Info */}
        <div className="mb-10 p-6 bg-white rounded-2xl shadow-md flex items-center gap-6">
          {/* Profile image placeholder */}
          <div className="w-24 h-24 rounded-full bg-[#c9b49a] flex items-center justify-center text-3xl text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#4a3728]">Name</label>
              <input
                value={user.name}
                disabled
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#c9b49a] bg-[#fdf6ef] text-[#4a3728] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#4a3728]">Email</label>
              <input
                value={user.email}
                disabled
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#c9b49a] bg-[#fdf6ef] text-[#4a3728] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#4a3728]">Role</label>
              <input
                value={user.role}
                disabled
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#c9b49a] bg-[#fdf6ef] text-[#4a3728] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-2xl font-semibold mb-4 text-[#4a3728]">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-[#8a6d5a]">You have no orders yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`p-4 rounded-2xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4
                  ${order.status === "pending" ? "bg-amber-100" : "bg-emerald-100"}`}
              >
                <div>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed at: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;