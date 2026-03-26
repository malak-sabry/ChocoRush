import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search, Heart, ShoppingCart, Check, ImageOff,
  SearchX, AlertCircle
} from "lucide-react";

const API_BASE = "http://localhost:5000";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [favourites, setFavourites] = useState({});
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`);
        setProducts(res.data);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleFav = (id) =>
    setFavourites((prev) => ({ ...prev, [id]: !prev[id] }));

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setCart((prev) => ({ ...prev, [id]: false })), 1500);
  };

  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5EDE3] font-sans">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F5EDE3]/90 backdrop-blur-md border-b
       border-[#C8813A]/15 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8813A] mb-1">
            ChocoRush
          </p>
          <h1 className="text-3xl font-extrabold text-[#3B1F0D] tracking-tight">
            Our Products
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-full px-4 
        py-2.5 shadow-sm min-w-[220px]">
          <Search size={16} className="text-[#9E7B65] opacity-60 shrink-0" />
          <input
            className="bg-transparent outline-none text-sm text-[#3B1F0D]
             placeholder-[#B89880] w-full"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Error */}
        {error && (
          <div className="bg-white border border-[#e8c4a8] rounded-2xl 
          p-6 text-center text-[#7B3F1E] text-sm flex items-center justify-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            Could not load products: {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-[#faf6f1] rounded-2xl overflow-hidden
               shadow-sm animate-pulse">
                <div className="aspect-square bg-[#e8ddd2]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-2.5 w-2/5 rounded-full bg-[#e8ddd2]" />
                  <div className="h-4 w-4/5 rounded-full bg-[#e8ddd2]" />
                  <div className="h-3 w-3/5 rounded-full bg-[#e8ddd2]" />
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-6 w-14 rounded-full bg-[#e8ddd2]" />
                    <div className="h-8 w-20 rounded-full bg-[#e8ddd2]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-[#9E7B65] gap-3">
            <SearchX size={56} className="opacity-30" />
            <p className="text-base font-semibold">No products found</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-xs font-semibold text-[#9E7B65] mb-4">
              {filtered.length} items
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filtered.map((product) => {
                const imageUrl = product.coverImage
                  ? `${API_BASE}/images/${product.coverImage}`
                  : null;

                const discountedPrice =
                  product.discountPercent > 0
                    ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
                    : null;

                const isFav = !!favourites[product._id];
                const isAdded = !!cart[product._id];

                return (
                  <div
                    key={product._id}
                    className="group bg-[#faf6f1] rounded-2xl
                     overflow-hidden shadow-md hover:shadow-xl transition-all 
                     duration-300 flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square bg-gradient-to-br 
                    from-[#f0e8df] to-[#e4d8cc] overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff size={48} className="text-[#C8813A] opacity-30" />
                        </div>
                      )}

                      {/* Discount Badge */}
                      {product.discountPercent > 0 && (
                        <span className="absolute top-3 left-3 bg-[#7B3F1E]
                         text-white text-[10px] font-bold px-2.5 py-1 
                         rounded-full tracking-wide">
                          {product.discountPercent}%
                        </span>
                      )}

                      {/* Favourite Button */}
                      <button
                        onClick={() => toggleFav(product._id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white 
                        rounded-full flex items-center justify-center
                         shadow-md"
                      >
                        <Heart
                          size={16}
                          className="text-[#7B3F1E] transition-all duration-200"
                          fill={isFav ? "#7B3F1E" : "none"}
                        />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      {product.category?.name && (
                        <span className="text-[10px] font-extrabold
                         uppercase tracking-widest text-[#C8813A]">
                          {product.category.name}
                        </span>
                      )}

                      <h3 className="text-sm font-bold text-[#3B1F0D] leading-snug line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-[11px] text-[#9E7B65] 
                      leading-relaxed line-clamp-2 flex-1">
                        {product.description}
                      </p>

                      {/* Stock indicator */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ?
                            "bg-green-400" : "bg-red-400"}`}
                        />
                        <span className="text-[10px] text-[#9E7B65] font-medium">
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </div>

                      {/* Price + Cart */}
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-col">
                          {discountedPrice && (
                            <span className="text-[10px] text-[#B89880] 
                            line-through leading-none">
                              ${product.price}
                            </span>
                          )}
                          <span className="text-lg font-extrabold text-[#3B1F0D] leading-tight">
                            ${discountedPrice ?? product.price}
                          </span>
                        </div>

                        <button
                          onClick={() => addToCart(product._id)}
                          disabled={product.stock === 0}
                          className={`flex items-center gap-1.5 px-3 py-2
                             rounded-full text-[11px] font-bold 
                             transition-all duration-200 active:scale-90
                            ${product.stock === 0
                              ? "bg-[#e8ddd2] text-[#B89880] cursor-not-allowed"
                              : isAdded
                                ? "bg-[#C8813A] text-white scale-105"
                                : "bg-[#3B1F0D] text-white hover:bg-[#7B3F1E]"
                            }`}
                        >
                          {isAdded
                            ? <Check size={14} />
                            : <ShoppingCart size={14} />
                          }
                          {isAdded ? "Added!" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}