import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, ImageOff, SearchX, AlertCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "./../Components/Layout";
import { useCart } from "../Auth/CartContext";
import { useAuth } from "../Auth/AuthContext";
import { toast } from "react-toastify";

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [favourites, setFavourites] = useState({});
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [cart]);

  useEffect(() => {
    axios
      .get("/api/products/favourites", { withCredentials: true })
      .then((res) => {
        const map = {};
        res.data.forEach((item) => {
          if (item.productId?._id) map[item.productId._id] = true;
        });
        setFavourites(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  const requireAuth = (e, action) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    action();
  };

  const toggleFav = async (e, productId) => {
    e.stopPropagation();
    setFavourites((prev) => ({ ...prev, [productId]: !prev[productId] }));
    try {
      await axios.post("/api/products/favourites", { productId }, { withCredentials: true });
    } catch {
      setFavourites((prev) => ({ ...prev, [productId]: !prev[productId] }));
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category?._id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-8">

          {/* ── TOOLBAR: search + categories ── */}
          <div className=" mb-6 sm:mb-8 space-y-3">

            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full sm:max-w-sm px-4 py-2.5 rounded-xl border border-[#e8c4a8]
                bg-[#f5eadd] shadow-sm text-sm text-[#3B1F0D] placeholder-[#B89880]
                focus:outline-none focus:ring-2 focus:ring-[#C8813A]/40"
            />

            {/* Category pills — horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none
              bg-[#FFF3E6] px-2 py-1.5 rounded-full border border-[#F2D2B6] shadow-sm w-fit max-w-full">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold
                  transition-colors duration-200 whitespace-nowrap
                  ${!selectedCategory
                    ? "bg-[#3B1F0D] text-white shadow"
                    : "text-[#3B1F0D] hover:bg-[#d4c3b1]"}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`capitalize flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold
                    transition-colors duration-200 whitespace-nowrap
                    ${selectedCategory === cat._id
                      ? "bg-[#3B1F0D] text-white shadow"
                      : "text-[#3B1F0D] hover:bg-[#d4c3b1]"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div className="bg-white border border-[#e8c4a8] rounded-2xl p-5 text-center
              text-[#7B3F1E] text-sm flex items-center justify-center gap-2">
              <AlertCircle size={16} />
              Could not load products: {error}
            </div>
          )}

          {/* ── SKELETONS ── */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-[#faf6f1] rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-[#e8ddd2]" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-[#e8ddd2] rounded w-3/4" />
                    <div className="h-3 bg-[#e8ddd2] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-[#9E7B65] gap-3">
              <SearchX size={48} className="opacity-30" />
              <p className="text-sm font-semibold">No products found</p>
            </div>
          )}

          {/* ── PRODUCTS GRID ── */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filtered.map((product) => {
                const imageUrl = product.coverImage ? `/api/images/${product.coverImage}` : null;
                const discountedPrice =
                  product.discountPercent > 0
                    ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
                    : null;
                const isFav = !!favourites[product._id];

                return (
                  <div
                    key={product._id}
                    className="group cursor-pointer bg-[#faf6f1] rounded-2xl
                      overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* ── IMAGE ── */}
                    <div className="relative aspect-square bg-[#e4d8cc]">
                      {imageUrl ? (
                        <img
                          onClick={() => navigate(`/shop/${product._id}`)}
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          onClick={() => navigate(`/shop/${product._id}`)}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <ImageOff size={40} className="opacity-30" />
                        </div>
                      )}

                      {/* Discount badge */}
                      {product.discountPercent > 0 && (
                        <span className="absolute top-2 left-2 bg-[#7B3F1E] text-white
                          text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                          -{product.discountPercent}%
                        </span>
                      )}

                      {/* Favourite button — 44px min touch target on mobile */}
                      <button
                        onClick={(e) => requireAuth(e, () => toggleFav(e, product._id))}
                        className="absolute top-1.5 right-1.5 w-8 h-8 sm:w-9 sm:h-9
                          bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center
                          shadow-sm active:scale-90 transition-transform duration-150"
                        aria-label="Toggle favourite"
                      >
                        <Heart
                          size={15}
                          fill={isFav ? "#7B3F1E" : "none"}
                          className="text-[#7B3F1E]"
                        />
                      </button>
                    </div>

                    {/* ── INFO ── */}
                    <div className="p-2.5 sm:p-3.5 flex flex-col gap-1.5">

                      {/* Title */}
                      <h3
                        onClick={() => navigate(`/shop/${product._id}`)}
                        className="text-[11px] sm:text-sm font-bold text-[#3B1F0D] line-clamp-2 leading-snug"
                      >
                        {product.title}
                      </h3>

                      {/* Description — hidden on very small screens */}
                      <p className="hidden sm:block text-[10px] sm:text-[11px] text-[#9E7B65] line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price row + Add to cart */}
                      <div className="flex items-center justify-between mt-0.5 gap-1">
                        {/* Prices */}
                        <div className="flex flex-col leading-none">
                          {discountedPrice && (
                            <span className="text-[9px] sm:text-[10px] line-through text-[#B89880]">
                              ${product.price}
                            </span>
                          )}
                          <span className="text-sm sm:text-base font-extrabold text-[#3B1F0D]">
                            ${discountedPrice ?? product.price}
                          </span>
                        </div>

                        {/* Add to cart — 36px min touch target */}
                        <button
                          onClick={(e) =>
                            requireAuth(e, () => {
                              addToCart(product._id);
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p._id === product._id ? { ...p, stock: p.stock - 1 } : p
                                )
                              );
                              toast.success("Added To Cart Successfully!");
                            })
                          }
                          disabled={product.stock === 0}
                          aria-label="Add to cart"
                          className={`flex items-center gap-1 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full
                            text-[10px] sm:text-[11px] font-bold transition-all duration-150
                            active:scale-90 select-none
                            ${product.stock === 0
                              ? "bg-[#e8ddd2] text-[#B89880] cursor-not-allowed"
                              : "bg-[#3B1F0D] text-white hover:bg-[#5a3a2a] cursor-pointer"}`}
                        >
                          <ShoppingCart size={11} className="flex-shrink-0" />
                          <span className="hidden xs:inline">Add</span>
                        </button>
                      </div>

                      {/* Stock label */}
                      <div className="leading-none">
                        {product.stock === 0 ? (
                          <span className="text-[9px] sm:text-[10px] font-semibold text-red-400">
                            Out of Stock
                          </span>
                        ) : product.stock <= 5 ? (
                          <span className="text-[9px] sm:text-[10px] font-semibold text-orange-400">
                            Only {product.stock} left!
                          </span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] font-semibold text-green-600">
                            In Stock ({product.stock})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default ProductGrid;