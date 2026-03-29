import Layout from "../Components/Layout";
import { useState } from "react";
import { toast } from "react-toastify";

const Checkout = () => {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryMethod: "cod",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Request failed");
      }

      toast.info("Order received. Admin will confirm it shortly.");
      setForm({ name: "", email: "", phone: "", address: "", deliveryMethod: "cod" });
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl border border-[#c9b49a]
    bg-white text-[#4a3728] placeholder-[#c0a88e]
    focus:outline-none focus:ring-2 focus:ring-[#a07850]
    transition duration-200
  `;

  const labelClass = "text-[#4a3728] font-semibold text-sm";

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-[#FCF0E6] rounded-3xl shadow-xl p-8">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#4a3728]">Checkout</h1>
            <p className="text-[#8a6d5a] text-sm mt-1">
              Enter your delivery details
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Left Column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your full name"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Delivery Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    rows={5}
                    placeholder="Street, building, city, notes..."
                    className={inputClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Delivery Method</label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border border-[#c9b49a] bg-white">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="cod"
                      checked
                      readOnly
                      className="accent-[#4a3728]"
                    />
                    <span className="text-[#4a3728] font-medium">
                      Cash on Delivery
                    </span>
                  </label>
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#4a3728] text-[#FCF0E6]
                font-semibold text-sm hover:bg-[#3a2a1e] active:scale-95
                transition duration-200 disabled:opacity-60"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;