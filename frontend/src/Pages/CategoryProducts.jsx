import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import { useCart } from "../Auth/CartContext";
import { useAuth } from "../Auth/AuthContext";
import { toast } from "react-toastify";
import Layout from "../Components/Layout";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState({});
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Fetch category & products
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);

        const catRes = await axios.get(`/api/categories/${categoryId}`);
        setCategory(catRes.data.category || catRes.data);

        const prodRes = await axios.get("/api/products");

        const filtered = prodRes.data.filter(p => {
          if (!p.category) return false;
          const catId = typeof p.category === "object" ? p.category._id : p.category;
          return String(catId) === String(categoryId);
        });

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching category/products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  // Fetch favourites
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get("/api/products/favourites", {
          withCredentials: true,
        });
        const favMap = {};
        res.data.forEach(item => {
          if (item.productId?._id) favMap[item.productId._id] = true;
        });
        setFavourites(favMap);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      }
    };

    fetchFavourites();
  }, []);

  const requireAuth = (e, action) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    action();
  };

  const toggleFav = async (e, productId) => {
    e.stopPropagation();
    setFavourites(prev => ({ ...prev, [productId]: !prev[productId] }));
    try {
      await axios.post(
        "/api/products/favourites",
        { productId },
        { withCredentials: true }
      );
    } catch {
      setFavourites(prev => ({ ...prev, [productId]: !prev[productId] }));
    }
  };

  if (loading) return <p className="p-10 text-center text-sm sm:text-base">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">

        {/* PAGE HEADING */}

        <h1 className="
         font-semibold tracking-wide mt-4 relative inline-block
            after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-1/3 after:bg-[#C9A66B] after:rounded-full
        ms-3
        text-3xl 
         sm:text-2xl md:text-3xl capitalize  mb-7 sm:mb-6 text-[#4a3728]">
          {category?.name ? `${category.name} Chocolates` : "Category Chocolates"}
        </h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-[#9E7B65] gap-3">
            <ImageOff size={40} className="opacity-30 sm:w-12 sm:h-12" />
            <p className="text-sm sm:text-base font-semibold text-center px-4">
              No products found in this category.
            </p>
          </div>
        ) : (
          /* GRID: 2 cols on mobile → 3 on sm → 4 on md → 5 on lg */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {products.map((product) => {
              const imageUrl = product.coverImage
                ? `/api/images/${product.coverImage}`
                : null;
              const discountedPrice = product.discountPercent > 0
                ? (product.price * (1 - product.discountPercent / 100)).toFixed(2)
                : null;
              const isFav = !!favourites[product._id];

              return (
                <div
                  key={product._id}
                  className="group cursor-pointer bg-[#faf6f1]/30 rounded-2xl
                    overflow-hidden shadow-md hover:shadow-lg transition-all"
                  onClick={() => navigate(`/shop/${product._id}`)}
                >
                  {/* IMAGE */}
                  <div className="relative aspect-square bg-[#e4d8cc]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff size={36} className="opacity-30 sm:w-12 sm:h-12" />
                      </div>
                    )}

                    {/* DISCOUNT BADGE */}
                    {product.discountPercent > 0 && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3
                        bg-[#7B3F1E] text-white text-[9px] sm:text-[10px] font-bold
                        px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full tracking-wide">
                        {product.discountPercent}%
                      </span>
                    )}

                    {/* FAVOURITE BUTTON */}
                    <button
                      onClick={(e) => requireAuth(e, () => toggleFav(e, product._id))}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3
                        w-7 h-7 sm:w-8 sm:h-8 bg-white/60 rounded-full
                        flex items-center justify-center touch-manipulation"
                      aria-label="Toggle favourite"
                    >
                      <Heart
                        size={18}
                        fill={isFav ? "#7B3F1E" : "none"}
                        className="text-[#7B3F1E] sm:w-[22px] sm:h-[22px]"
                      />
                    </button>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="p-2.5 sm:p-3 md:p-4 flex flex-col gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold line-clamp-2 leading-tight">
                      {product.title}
                    </h3>

                    {/* Description hidden on very small screens, shown sm+ */}
                    <p className="hidden sm:block text-[11px] text-[#9E7B65] line-clamp-2">
                      {product.description}
                    </p>

                    {/* PRICE & ADD TO CART */}
                    <div className="flex justify-between items-end mt-1 gap-1">
                      <div className="min-w-0">
                        {discountedPrice && (
                          <span className="text-[9px] sm:text-[10px] line-through text-[#B89880] block">
                            ${product.price}
                          </span>
                        )}
                        <div className="text-base sm:text-lg font-extrabold leading-tight">
                          ${discountedPrice ?? product.price}
                        </div>
                      </div>

                      <button
                        onClick={(e) =>
                          requireAuth(e, () => {
                            addToCart(product._id);
                            setProducts(prev =>
                              prev.map(p =>
                                p._id === product._id
                                  ? { ...p, stock: p.stock - 1 }
                                  : p
                              )
                            );
                            toast.success("Added To Cart Successfully!");
                          })
                        }
                        disabled={product.stock === 0}
                        className={`flex items-center gap-1 sm:gap-1.5
                          px-2 sm:px-3 py-1.5 sm:py-2 rounded-full
                          text-[10px] sm:text-[11px] font-bold
                          transition-all duration-200 active:scale-90
                          touch-manipulation shrink-0 cursor-pointer
                          ${product.stock === 0
                            ? "bg-[#e8ddd2] text-[#B89880] cursor-not-allowed"
                            : "bg-[#3B1F0D] text-white hover:bg-[#5a483e]"
                          }`}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={12} className="sm:w-3.5 sm:h-3.5" />
                        {/* Label hidden on xs to keep button compact */}
                        <span className="hidden xs:inline sm:inline">Add</span>
                      </button>
                    </div>

                    {/* STOCK */}
                    <div className="flex items-center gap-1.5">
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
    </Layout>
  );
};

export default CategoryProducts;