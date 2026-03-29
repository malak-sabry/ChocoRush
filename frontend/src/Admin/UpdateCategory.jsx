import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const UpdateCategory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState(null)
  const [newImage, setNewImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const BASE_URL = "http://localhost:5000"

  useEffect(() => {
    fetch(`${BASE_URL}/categories/${id}`)
      .then(res => res.json())
      .then(data => {
        setCategory(data.category)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching category:", err)
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCategory(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (file) => {
    if (!file) return
    setNewImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleUpdate = async () => {
    setMessage(null)
    if (!category?.name?.trim()) {
      setMessage({ type: "error", text: "Category name is required." })
      return
    }
    try {
      setSubmitting(true)
      const fd = new FormData()
      fd.append("name", category.name)
      if (newImage) fd.append("coverImage", newImage)

      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to update category")
      setMessage({ type: "success", text: data.message || "Category updated successfully!" })
      setCategory(data.category)
      setNewImage(null)
      setPreview(null)
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this category?")) return
    try {
      setDeleting(true)
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to delete category")
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

  const displayImage = preview || (category?.coverImage ? `${BASE_URL}/images/${category.coverImage}` : null)

  if (loading) return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <p className="text-[#8a6d5a] text-sm">Loading category...</p>
    </section>
  )

  if (!category) return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <p className="text-[#8a6d5a] text-sm">No category found.</p>
    </section>
  )

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-[#FCF0E6] rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#4a3728]">Update Category</h1>
          <p className="text-[#8a6d5a] text-sm mt-1">
            Edit the details below to update this category
          </p>
        </div>

        <div className="flex flex-col gap-6">

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={category?.name || ""}
              onChange={handleChange}
              placeholder="Category name"
              className={inputClass}
            />
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Cover Image</label>

            <div
              onClick={() => document.getElementById("catImageInput").click()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) handleImageChange(file)
              }}
              onDragOver={(e) => e.preventDefault()}
              className="relative w-full h-48 rounded-2xl border-2 border-dashed
                border-[#c9b49a] bg-white flex flex-col items-center justify-center
                cursor-pointer hover:border-[#a07850] hover:bg-[#fdf5ec]
                transition duration-200 overflow-hidden group"
            >
              {displayImage ? (
                <>
                  <img
                    src={displayImage}
                    alt="cover preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100
                    transition duration-200 flex items-center justify-center rounded-2xl">
                    <span className="text-white text-sm font-medium">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-[#c9b49a] mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p className="text-[#a07850] text-sm font-medium">Click or drag & drop to upload</p>
                  <p className="text-[#c0a88e] text-xs mt-1">PNG, JPG, WEBP</p>
                </>
              )}
            </div>

            <input
              id="catImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
            />

            {/* Staged file badge */}
            {newImage && (
              <div className="flex items-center justify-between px-3 py-2 bg-[#f0e0cc] rounded-xl">
                <span className="text-[#4a3728] text-xs font-medium truncate">{newImage.name}</span>
                <button
                  type="button"
                  onClick={() => { setNewImage(null); setPreview(null) }}
                  className="text-[#a07850] hover:text-[#4a3728] text-xs ml-3 shrink-0 transition"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Feedback Message */}
          {message && (
            <div className={`text-sm px-4 py-3 rounded-xl font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}>
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleUpdate}
              disabled={submitting || deleting}
              className="flex-1 py-3 rounded-xl bg-[#4a3728] text-[#FCF0E6]
                font-semibold text-sm hover:bg-[#3a2a1e] active:scale-95
                transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Category"}
            </button>

            <button
              onClick={handleDelete}
              disabled={submitting || deleting}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white
                font-semibold text-sm hover:bg-red-600 active:scale-95
                transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting..." : "Delete Category"}
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

export default UpdateCategory