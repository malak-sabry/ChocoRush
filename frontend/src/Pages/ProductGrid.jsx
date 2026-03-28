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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [favourites, setFavourites] = useState({});
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();

  // FETCH PRODUCTS
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [cart]);

  // FETCH FAVOURITES
  useEffect(() => {
    axios
      .get("http://localhost:5000/products/favourites", { withCredentials: true })
      .then((res) => {
        const map = {};
        res.data.forEach((item) => {
          if (item.productId?._id) {
            map[item.productId._id] = true;
          }
        });
        setFavourites(map);
      })
      .catch(() => { });
  }, []);

  // REQUIRE AUTH
  const requireAuth = (e, action) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    action();
  };

  // TOGGLE FAVOURITE
  const toggleFav = async (e, productId) => {
    e.stopPropagation();

    setFavourites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));

    try {
      await axios.post(
        "http://localhost:5000/products/favourites",
        { productId },
        { withCredentials: true }
      );
    } catch {
      setFavourites((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
    }
  };

  // SEARCH FILTER
  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <section className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* SEARCH INPUT */}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full max-w-md px-4 py-2.5 rounded-xl border border-[#e8c4a8]
              bg-white text-sm text-[#3B1F0D] placeholder-[#B89880]
              focus:outline-none focus:ring-2 focus:ring-[#C8813A]/40"
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-white border border-[#e8c4a8] rounded-2xl
            p-6 text-center text-[#7B3F1E] text-sm flex items-center justify-center gap-2">
              <AlertCircle size={16} />
              Could not load products: {error}
            </div>
          )}

          {/* LOADING SKELETONS */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#faf6f1] rounded-2xl overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="aspect-square bg-[#e8ddd2]" />
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-[#9E7B65] gap-3">
              <SearchX size={56} className="opacity-30" />
              <p className="text-base font-semibold">No products found</p>
            </div>
          )}

          {/* PRODUCTS GRID */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filtered.map((product) => {
                const imageUrl = product.coverImage
                  ? `http://localhost:5000/images/${product.coverImage}`
                  : null;

                const discountedPrice =
                  product.discountPercent > 0
                    ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
                    : null;

                const isFav = !!favourites[product._id];

                return (
                  <div
                    key={product._id}
                    className="group cursor-pointer bg-[#faf6f1]/30 rounded-2xl
                    overflow-hidden shadow-md hover:shadow-lg transition-all"
                  >
                    {/* IMAGE */}
                    <div className="relative aspect-square bg-[#e4d8cc]">
                      {imageUrl ? (
                        <img
                          onClick={() => navigate(`/shop/${product._id}`)}
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff size={48} className="opacity-30" />
                        </div>
                      )}

                      {/* DISCOUNT BADGE */}
                      {product.discountPercent > 0 && (
                        <span className="absolute top-3 left-3 bg-[#7B3F1E]
                         text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                          {product.discountPercent}%
                        </span>
                      )}

                      {/* FAVOURITE BUTTON */}
                      <button
                        onClick={(e) => requireAuth(e, () => toggleFav(e, product._id))}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/60
                        rounded-full flex items-center justify-center"
                      >
                        <Heart
                          size={22}
                          fill={isFav ? "#7B3F1E" : "none"}
                          className="text-[#7B3F1E]"
                        />
                      </button>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="text-sm font-bold line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-[11px] text-[#9E7B65] line-clamp-2">
                        {product.description}
                      </p>

                      {/* PRICE AND ADD TO CART */}
                      <div className="flex justify-between items-end">
                        <div className="mt-1">
                          {discountedPrice && (
                            <span className="text-[10px] line-through text-[#B89880]">
                              ${product.price}
                            </span>
                          )}
                          <div className="text-lg font-extrabold">
                            ${discountedPrice ?? product.price}
                          </div>
                        </div>

                        {/* ADD TO CART BUTTON */}
                        <button
                          onClick={(e) =>
                            requireAuth(e, () => {
                              addToCart(product._id);
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p._id === product._id
                                    ? { ...p, stock: p.stock - 1 }
                                    : p
                                )
                              );
                              toast.success("Added To Cart Successfully!");
                            })
                          }
                          disabled={product.stock === 0}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-90 cursor-pointer
                          ${product.stock === 0
                              ? "bg-[#e8ddd2] text-[#B89880] cursor-not-allowed"
                              : "bg-[#3B1F0D] text-white hover:bg-[#5a483e]"
                            }`}
                        >
                          <ShoppingCart size={14} /> Add
                        </button>
                      </div>

                      {/* STOCK INDICATOR */}
                      <div className="flex items-center gap-1.5">
                        {product.stock === 0 ? (
                          <span className="text-[10px] font-semibold text-red-400">
                            Out of Stock
                          </span>
                        ) : product.stock <= 5 ? (
                          <span className="text-[10px] font-semibold text-orange-400">
                            Only {product.stock} left!
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-green-600">
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