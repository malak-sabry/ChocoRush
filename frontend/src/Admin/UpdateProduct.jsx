import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const UpdateProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState(null)
  const [newImage, setNewImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const BASE_URL = "http://localhost:5000"

  useEffect(() => {
    fetch(`${BASE_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.targetProduct)
        setLoading(false)
      })
      .catch(err => {
        console.log("Error fetching product:", err)
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleImageChange = (file) => {
    if (!file) return
    setNewImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleUpdate = async () => {
    setMessage(null)
    if (!product.title || !product.brand || !product.description || !product.price || !product.stock) {
      setMessage({ type: "error", text: "All fields (title, brand, description, price, stock) are required." })
      return
    }
    try {
      setSubmitting(true)
      const fd = new FormData()
      fd.append("title", product.title)
      fd.append("brand", product.brand)
      fd.append("description", product.description)
      fd.append("price", String(product.price))
      fd.append("stock", String(product.stock))
      fd.append("discountPercent", String(product.discountPercent ?? ""))
      fd.append("isFeatured", String(product.isFeatured ?? false))
      fd.append("isOnSale", String(product.isOnSale ?? false))
      if (newImage) fd.append("coverImage", newImage)

      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to update product")
      setMessage({ type: "success", text: data.message || "Product updated successfully!" })
      setProduct(data.targetProduct)
      setNewImage(null)
      setPreview(null)
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      setDeleting(true)
      const res = await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to delete product")
      navigate("/admin")
    } catch (error) {
      setMessage({ type: "error", text: error.message })
      setDeleting(false)
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border border-[#c9b49a]
    bg-white text-[#4a3728] placeholder-[#c0a88e]
    focus:outline-none focus:ring-2 focus:ring-[#a07850]
    transition duration-200`

  const labelClass = "text-[#4a3728] font-semibold text-sm"

  const displayImage = preview || (product?.coverImage ? `${BASE_URL}/images/${product.coverImage}` : null)

  if (loading) return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <p className="text-[#8a6d5a] text-sm">Loading product...</p>
    </section>
  )

  if (!product) return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <p className="text-[#8a6d5a] text-sm">No product found.</p>
    </section>
  )

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-[#FCF0E6] rounded-3xl shadow-xl p-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#4a3728]">Update Product</h1>
          <p className="text-[#8a6d5a] text-sm mt-1">
            Edit the details below to update this product
          </p>
        </div>

        <div className="flex flex-col gap-6">

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Title <span className="text-red-400">*</span></label>
              <input name="title" value={product?.title || ""} onChange={handleChange} placeholder="Product title" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Brand <span className="text-red-400">*</span></label>
              <input name="brand" value={product?.brand || ""} onChange={handleChange} placeholder="Brand name" className={inputClass} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Price <span className="text-red-400">*</span></label>
              <input type="number" name="price" min="0" step="0.01" value={product?.price || ""} onChange={handleChange} placeholder="e.g. 19.99" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Stock <span className="text-red-400">*</span></label>
              <input type="number" name="stock" min="0" step="1" value={product?.stock || ""} onChange={handleChange} placeholder="e.g. 20" className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Description <span className="text-red-400">*</span></label>
            <textarea name="description" value={product?.description || ""} onChange={handleChange} rows={4} placeholder="Write a short description..." className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Discount Percent</label>
            <input type="number" name="discountPercent" min="0" max="100" step="1" value={product?.discountPercent || ""} onChange={handleChange} placeholder="e.g. 10" className={inputClass} />
          </div>

          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={product?.isFeatured || false} onChange={handleChange} className="h-4 w-4 rounded border-[#c9b49a] accent-[#4a3728]" />
              <span className="text-[#4a3728] text-sm font-medium">Featured</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isOnSale" checked={product?.isOnSale || false} onChange={handleChange} className="h-4 w-4 rounded border-[#c9b49a] accent-[#4a3728]" />
              <span className="text-[#4a3728] text-sm font-medium">On Sale</span>
            </label>
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Cover Image</label>
            <div
              onClick={() => document.getElementById("coverImageInput").click()}
              onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleImageChange(file) }}
              onDragOver={(e) => e.preventDefault()}
              className="relative w-full h-44 rounded-2xl border-2 border-dashed
                border-[#c9b49a] bg-white flex flex-col items-center justify-center
                cursor-pointer hover:border-[#a07850] hover:bg-[#fdf5ec]
                transition duration-200 overflow-hidden group"
            >
              {displayImage ? (
                <>
                  <img src={displayImage} alt="cover preview" className="w-full h-full object-cover rounded-2xl" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center rounded-2xl">
                    <span className="text-white text-sm font-medium">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#c9b49a] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-[#a07850] text-sm font-medium">Click or drag & drop to upload</p>
                  <p className="text-[#c0a88e] text-xs mt-1">PNG, JPG, WEBP</p>
                </>
              )}
            </div>
            <input id="coverImageInput" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0])} />
            {newImage && (
              <div className="flex items-center justify-between px-3 py-2 bg-[#f0e0cc] rounded-xl">
                <span className="text-[#4a3728] text-xs font-medium truncate">{newImage.name}</span>
                <button type="button" onClick={() => { setNewImage(null); setPreview(null) }} className="text-[#a07850] hover:text-[#4a3728] text-xs ml-3 shrink-0 transition">
                  Remove
                </button>
              </div>
            )}
          </div>

          {message && (
            <div className={`text-sm px-4 py-3 rounded-xl font-medium ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={handleUpdate} disabled={submitting || deleting}
              className="flex-1 py-3 rounded-xl bg-[#4a3728] text-[#FCF0E6] font-semibold text-sm hover:bg-[#3a2a1e] active:scale-95 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Updating..." : "Update Product"}
            </button>
            <button onClick={handleDelete} disabled={submitting || deleting}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 active:scale-95 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              {deleting ? "Deleting..." : "Delete Product"}
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

export default UpdateProduct