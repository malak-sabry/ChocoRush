import { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    discountPercent: "",
    isFeatured: false,
    isOnSale: false,
    coverImage: null,
  });

  // Load categories
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await axios.get("/api/categories", { withCredentials: true });
        setCategories(Array.isArray(res.data) ? res.data : (res.data?.categories || []));
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCats(false);
      }
    };
    loadCats();
  }, []);

  const onChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "file") {
      const file = files?.[0] || null;
      setForm((p) => ({ ...p, [name]: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
      return;
    }
    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.title || !form.brand || !form.description || !form.price || !form.stock) {
      setMessage({
        type: "error",
        text: "All fields (title, brand, description, price, stock) are required.",
      });
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("brand", form.brand);
    fd.append("description", form.description);
    fd.append("price", String(form.price));
    fd.append("stock", String(form.stock));
    fd.append("discountPercent", String(form.discountPercent));
    if (form.category) fd.append("category", form.category);
    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isOnSale", String(form.isOnSale));
    if (form.coverImage) fd.append("coverImage", form.coverImage);

    try {
      setSubmitting(true);
      const res = await axios.post("/products", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Product added successfully!" });

      setForm({
        title: "",
        brand: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        discountPercent: "",
        isFeatured: false,
        isOnSale: false,
        coverImage: null,
      });
      setPreview(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || error.message || "Failed to add product",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-[#c9b49a]
    bg-white text-[#4a3728] placeholder-[#c0a88e]
    focus:outline-none focus:ring-2 focus:ring-[#a07850]
    transition duration-200`;

  const labelClass = "text-[#4a3728] font-semibold text-sm";

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-[#FCF0E6] rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#4a3728]">Add Product</h1>
          <p className="text-[#8a6d5a] text-sm mt-1">
            Fill in the details to add a new product
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">

          {/* Title & Brand */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Product title"
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Brand <span className="text-red-400">*</span>
              </label>
              <input
                name="brand"
                value={form.brand}
                onChange={onChange}
                placeholder="Brand name"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Price <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={form.price}
                onChange={onChange}
                placeholder="e.g. 19.99"
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Stock <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                value={form.stock}
                onChange={onChange}
                placeholder="e.g. 20"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              placeholder="Write a short description..."
              className={inputClass}
              required
            />
          </div>

          {/* Category & Discount */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                disabled={loadingCats}
                className={`${inputClass} bg-white`}
              >
                <option value="">{loadingCats ? "Loading..." : "Select category"}</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Discount Percent</label>
              <input
                type="number"
                name="discountPercent"
                min="0"
                max="100"
                step="1"
                value={form.discountPercent}
                onChange={onChange}
                placeholder="e.g. 10"
                className={inputClass}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={onChange}
                className="h-4 w-4 rounded border-[#c9b49a] accent-[#4a3728]"
              />
              <span className="text-[#4a3728] text-sm font-medium">Featured</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isOnSale"
                checked={form.isOnSale}
                onChange={onChange}
                className="h-4 w-4 rounded border-[#c9b49a] accent-[#4a3728]"
              />
              <span className="text-[#4a3728] text-sm font-medium">On Sale</span>
            </label>
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Cover Image</label>

            <div
              onClick={() => document.getElementById("coverImageInput").click()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (!file) return;
                setForm((p) => ({ ...p, coverImage: file }));
                setPreview(URL.createObjectURL(file));
              }}
              onDragOver={(e) => e.preventDefault()}
              className="relative w-full h-44 rounded-2xl border-2 border-dashed
                border-[#c9b49a] bg-white flex flex-col items-center justify-center
                cursor-pointer hover:border-[#a07850] hover:bg-[#fdf5ec]
                transition duration-200 overflow-hidden group"
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="preview"
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
                  <p className="text-[#a07850] text-sm font-medium">
                    Click or drag & drop to upload
                  </p>
                  <p className="text-[#c0a88e] text-xs mt-1">PNG, JPG, WEBP</p>
                </>
              )}
            </div>

            <input
              id="coverImageInput"
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`text-sm px-4 py-3 rounded-xl font-medium ${message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#4a3728] text-[#FCF0E6]
              font-semibold text-sm hover:bg-[#3a2a1e] active:scale-95
              transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;