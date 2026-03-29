import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './../Components/Layout';

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Register failed");

      navigate("/");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
  <div className="flex justify-center items-center min-h-screen  px-4">
      <div className="w-full max-w-md bg-[#FCF0E6] p-8 rounded-xl shadow-lg border border-[#c9b49a]">
        <h1 className="text-3xl font-bold text-[#4a3728] text-center mb-6 capitalize">Register an Account</h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-[#4a3728] font-medium mb-2">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-[#c9b49a] rounded-lg focus:ring-2 focus:ring-[#4a3728] focus:outline-none transition placeholder:text-[#8a6d5a]"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[#4a3728] font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-[#c9b49a] rounded-lg focus:ring-2 focus:ring-[#4a3728] focus:outline-none transition placeholder:text-[#8a6d5a]"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#4a3728] font-medium mb-2">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-[#c9b49a] rounded-lg focus:ring-2 focus:ring-[#4a3728] focus:outline-none transition placeholder:text-[#8a6d5a]"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              required
            />
          </div>

          {err && <p className="text-red-500 text-sm text-center">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a3728] text-[#FCF0E6] font-semibold py-2 rounded-lg hover:bg-[#8a6d5a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[#8a6d5a] text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-[#4a3728] font-semibold hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
    </Layout>
  
  );
}

export default Register;