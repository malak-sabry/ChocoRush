import { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: "" }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setMessage({ type: "error", text: "Category name is required." });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("coverImage", image);

    try {
      setLoading(true);
      setMessage(null);
      await axios.post("http://localhost:5000/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ type: "success", text: "Category added successfully!" });
      setName("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex 
    items-center justify-center px-4 ">
      <div className="w-full max-w-md bg-[#FCF0E6] rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#4a3728]">Add Category</h1>
          <p className="text-[#8a6d5a] text-sm mt-1">
            Fill in the details to create a new category
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#4a3728] font-semibold text-sm">
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cakes, Cookies, Drinks..."
              className="w-full px-4 py-3 rounded-xl border border-[#c9b49a]
                bg-white text-[#4a3728] placeholder-[#c0a88e]
                focus:outline-none focus:ring-2 focus:ring-[#a07850]
                transition duration-200"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#4a3728] font-semibold text-sm">
              Category Image
            </label>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("imageInput").click()}
              className="relative w-full h-44 rounded-2xl border-2 border-dashed
                border-[#c9b49a] bg-white flex flex-col items-center justify-center
                cursor-pointer hover:border-[#a07850] hover:bg-[#fdf5ec]
                transition duration-200 overflow-hidden group"
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  {/* Overlay on hover */}
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
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#4a3728] text-[#FCF0E6]
              font-semibold text-sm hover:bg-[#3a2a1e] active:scale-95
              transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default AddCategory;