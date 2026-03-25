import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {


   const [form,setForm] = useState({email:"",password:"", name:""})
   const [loading ,setLoading] = useState(false)
    const [err,setErr] = useState("")
   const navigate = useNavigate()


   const onSubmit=async(e)=>{
    e.preventDefault()
     setErr(""); 
    setLoading(true)

    try{
   const res = await fetch("http://localhost:5000/users/register",{
     method:"POST",
     headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify(form),

   })

   const data = await res.json()

    if (!res.ok) throw new Error(data?.message || "Register failed");

    navigate("/")

    }catch (error) {
     setErr(error.message);
    }finally{
        setLoading(false)
    }

   }



return (
   <div className="max-w-md mx-auto py-10 mt-40">
      <h1 className="text-2xl font-bold mb-6">Sign up</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
        />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button
          disabled={loading}
          className="bg-[#F86D72] text-white px-4 py-2 rounded w-full"
        >
          {loading ? "..." : "Create account"}
        </button>
      </form>
    </div>
  )
}

export default Register