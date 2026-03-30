import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from './../Components/Layout';
import { Loader2, AlertTriangle, ImageOff, Star, Heart, ShoppingCart, Check } from "lucide-react";
import { useCart } from "../Auth/CartContext";
import { toast } from "react-toastify";

const API_BASE = "/api";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No product ID found in URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE}/products/${id}`)
      .then(({ data }) => {
        setProduct(data.targetProduct);
        axios
          .get(`${API_BASE}/products/favourites`, { withCredentials: true })
          .then(({ data: favData }) => {
            const alreadyFavourited = favData.some(
              (item) => item.productId._id === id
            );
            setIsFavourited(alreadyFavourited);
          })
          .catch(() => { });
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load product.")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error("Product is out of stock!");
      return;
    }
    try {
      await addToCart(product._id, qty);
      setAdded(true);
      toast.success("Added to cart successfully!");
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    }
  };

  const handleToggleFavourite = async () => {
    const previous = isFavourited;
    setIsFavourited(!previous);
    try {
      await axios.post(
        `${API_BASE}/products/favourites`,
        { productId: id },
        { withCredentials: true }
      );
    } catch (err) {
      setIsFavourited(previous);
      console.error("Failed to toggle favourite:", err.message);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-amber-700" />
          <p className="text-sm tracking-widest uppercase text-amber-600">
            Loading product…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-amber-50 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <p className="font-medium text-stone-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-amber-800 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-900 transition"
        >
          Try again
        </button>
      </div>
    );

  if (!product) return null;

  const finalPrice = product.discountPercent
    ? (product.price - (product.price * product.discountPercent) / 100).toFixed(2)
    : null;

  const stockOut = product.stock === 0;
  const stockLow = product.stock > 0 && product.stock <= 5;

  const stockColor = stockOut
    ? "bg-red-100 text-red-700"
    : stockLow
      ? "bg-yellow-100 text-yellow-800"
      : "bg-amber-100 text-amber-800";

  const stockDot = stockOut
    ? "bg-red-500"
    : stockLow
      ? "bg-yellow-500"
      : "bg-amber-600";

  const stockLabel = stockOut
    ? "Out of stock"
    : stockLow
      ? `Only ${product.stock} left`
      : "In stock";

  const rating = 4.3;

  return (
    <Layout>
      <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-4">
        <div className="mx-auto max-w-5xl">

          {/* Card */}
          <div className="overflow-hidden rounded-2xl bg-[#FFFBEB] shadow-sm ring-1 ring-amber-100">
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Left: Image */}
              <div className="relative flex min-h-[260px] sm:min-h-[360px] items-center justify-center bg-[#ece8d9] p-6 sm:p-10">
                {product.discountPercent > 0 && (
                  <div className="absolute left-3 top-3 sm:left-4 sm:top-4 z-10 rounded-full bg-red-700 px-2.5 py-1 text-xs font-bold text-white shadow">
                    -{product.discountPercent}% OFF
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 rounded-full bg-amber-800 px-2.5 py-1 text-xs font-bold text-white shadow">
                    ★ Featured
                  </div>
                )}
                {product.coverImage ? (
                  <img
                    src={`${API_BASE}/images/${product.coverImage}`}
                    alt={product.title}
                    className="h-65 rounded-2xl w-65 object-cover"
                  />
                ) : (
                  <div className="flex h-48 w-48 sm:h-64 sm:w-64 flex-col items-center justify-center rounded-xl bg-amber-100 text-amber-400">
                    <ImageOff className="h-12 w-12 sm:h-16 sm:w-16" />
                    <span className="mt-2 text-sm">No image</span>
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="flex flex-col justify-between p-5 sm:p-8 md:p-10">
                <div className="space-y-4 sm:space-y-5">

                  {/* Brand + Category */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
                      {product.brand}
                    </span>
                    {product.category?.name && (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                        {product.category.name}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight text-stone-900">
                    {product.title}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="h-4 w-4"
                        fill={s <= Math.round(rating) ? "#f59e0b" : "#e7e5e4"}
                        stroke={s <= Math.round(rating) ? "#f59e0b" : "#e7e5e4"}
                      />
                    ))}
                    <span className="ml-1 text-sm text-stone-400">{rating} / 5</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-900">
                      ${finalPrice ?? Number(product.price).toFixed(2)}
                    </span>
                    {finalPrice && (
                      <span className="text-base sm:text-lg text-stone-400 line-through">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${stockColor}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${stockDot}`} />
                      {stockLabel}
                    </span>
                  </div>
                </div>

                {/* Qty + Buttons */}
                <div className="mt-6 sm:mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-stone-600">Qty</label>
                    <div className="flex items-center overflow-hidden rounded-lg border border-amber-200 bg-amber-50">
                      <button
                        type="button"
                        onClick={() => setQty((q) => (q > 1 ? q - 1 : 1))}
                        className="px-3 py-2 text-lg font-bold text-amber-800 hover:bg-amber-100 transition"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) setQty(Math.min(Math.max(val, 1), product.stock));
                        }}
                        className="w-12 text-center border-x border-amber-200 bg-amber-50 text-sm font-semibold text-stone-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQty((q) => (q < product.stock ? q + 1 : product.stock))}
                        className="px-3 py-2 text-lg font-bold text-amber-800 hover:bg-amber-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={stockOut}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold tracking-wide shadow-sm transition-all duration-200
                        ${stockOut
                          ? "cursor-not-allowed bg-stone-200 text-stone-400"
                          : added
                            ? "scale-95 bg-amber-600 text-white"
                            : "bg-amber-800 text-white hover:bg-amber-900 hover:shadow-md active:scale-95"
                        }`}
                    >
                      {added
                        ? <><Check className="h-4 w-4" /> Added to Cart</>
                        : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
                      }
                    </button>

                    <button
                      onClick={handleToggleFavourite}
                      className={`rounded-xl border px-4 py-3 transition-all duration-200 active:scale-90
                        ${isFavourited
                          ? "border-red-300 text-red-500 hover:border-red-400"
                          : "border-amber-200 text-stone-400 hover:border-red-300 hover:text-red-500"
                        }`}
                      title={isFavourited ? "Remove from favourites" : "Add to favourites"}
                    >
                      <Heart
                        className="h-5 w-5"
                        fill={isFavourited ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-amber-100">
              <div className="flex gap-1 px-4 sm:px-8 pt-4 overflow-x-auto">
                {["description", "details"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap rounded-t-lg px-4 sm:px-5 py-2.5 text-sm font-semibold capitalize transition
                      ${activeTab === tab
                        ? "border-b-2 border-amber-800 bg-amber-50 text-amber-900"
                        : "text-stone-400 hover:text-stone-700"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="px-4 sm:px-8 py-5 sm:py-6 text-sm leading-relaxed text-stone-600">
                {activeTab === "description" ? (
                  <p>{product.description || "No description provided."}</p>
                ) : (
                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4">
                    {[
                      ["Title", product.title],
                      ["Brand", product.brand],
                      ["Category", product.category?.name || "—"],
                      ["Price", `$${Number(product.price).toFixed(2)}`],
                      ["Discount", product.discountPercent ? `${product.discountPercent}%` : "None"],
                      ["Stock", `${product.stock} units`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                          {label}
                        </dt>
                        <dd className="mt-0.5 break-all font-medium text-stone-700">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}