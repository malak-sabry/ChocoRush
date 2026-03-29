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

        // Fetch category
        const catRes = await axios.get(`http://localhost:5000/categories/${categoryId}`);
        console.log("Category response:", catRes.data);
        setCategory(catRes.data.category || catRes.data);

        // Fetch all products
        const prodRes = await axios.get("http://localhost:5000/products");
        console.log("All products:", prodRes.data);

        // Filter safely by category
        const filtered = prodRes.data.filter(p => {
          if (!p.category) return false; // skip products without category
          const catId = typeof p.category === "object" ? p.category._id : p.category;
          return String(catId) === String(categoryId);
        });

        console.log("Filtered products:", filtered);
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
        const res = await axios.get("http://localhost:5000/products/favourites", {
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

  // Require login for actions
  const requireAuth = (e, action) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    action();
  };

  // Toggle favourite
  const toggleFav = async (e, productId) => {
    e.stopPropagation();
    setFavourites(prev => ({ ...prev, [productId]: !prev[productId] }));
    try {
      await axios.post(
        "http://localhost:5000/products/favourites",
        { productId },
        { withCredentials: true }
      );
    } catch {
      // Revert on error
      setFavourites(prev => ({ ...prev, [productId]: !prev[productId] }));
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl capitalize font-bold mb-6 text-[#4a3728]">
          {category?.name ? `${category.name} Chocolates` : "Category Chocolates"}
        </h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#9E7B65] gap-3">
            <ImageOff size={48} className="opacity-30" />
            <p className="text-base font-semibold">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {products.map((product) => {
              const imageUrl = product.coverImage
                ? `http://localhost:5000/images/${product.coverImage}`
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
                    <h3 className="text-sm font-bold line-clamp-2">{product.title}</h3>
                    <p className="text-[11px] text-[#9E7B65] line-clamp-2">{product.description}</p>

                    {/* PRICE & ADD TO CART */}
                    <div className="flex justify-between items-end mt-1">
                      <div>
                        {discountedPrice && (
                          <span className="text-[10px] line-through text-[#B89880]">
                            ${product.price}
                          </span>
                        )}
                        <div className="text-lg font-extrabold">
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
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-90 cursor-pointer
                          ${product.stock === 0
                            ? "bg-[#e8ddd2] text-[#B89880] cursor-not-allowed"
                            : "bg-[#3B1F0D] text-white hover:bg-[#5a483e]"
                          }`}
                      >
                        <ShoppingCart size={14} /> Add
                      </button>
                    </div>

                    {/* STOCK */}
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
    </Layout>
  );
};

export default CategoryProducts;