import { ShoppingCart } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Auth/CartContext";
import { toast } from "react-toastify";

const OfferSkeleton = () => (
  <div className="my-2 relative bg-[#E8DED3] rounded-2xl p-4 w-full sm:max-w-[230px] shadow-sm">
    {/* Discount badge */}
    <div className="absolute top-3 right-3 w-10 h-5 rounded-md bg-[#1C120A]/20 overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>

    {/* Image */}
    <div className="w-full h-40 lg:h-44 rounded-xl bg-[#D4C5B5] relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>

    {/* Title lines */}
    <div className="mt-3 px-1 space-y-2">
      <div className="h-3 w-full rounded-full bg-[#C9B8A8] relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.1s] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="h-3 w-2/3 rounded-full bg-[#C9B8A8] relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    </div>

    {/* Bottom row */}
    <div className="mt-3 flex items-center justify-between px-1">
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-10 rounded-full bg-[#C9B8A8] relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.3s] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="h-4 w-16 rounded-full bg-[#C9B8A8] relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.4s] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-[#4F342F]/30 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.5s] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  </div>
);

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      const topDiscounts = response.data
        .sort((a, b) => b.discountPercent - a.discountPercent)
        .slice(0, 5);
      setProducts(topDiscounts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (product.stock === 0) {
      toast.error("Product is out of stock!");
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.title} added to cart!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart.");
    }
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <section className="flex flex-col lg:flex-row bg-[#1C120A]/80 rounded-xl mb-4 overflow-hidden">
        {/* Left: Title + Button */}
        <div className="flex justify-center items-center flex-col gap-4 p-6 lg:p-9 lg:min-w-[160px]">
          <h3 className="text-lg md:text-xl font-semibold tracking-wide text-[#F5EDE3] relative inline-block
            after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-1/3 after:bg-[#C9A66B] after:rounded-full">
            Top 5 Offers
          </h3>
          <Link
            to="/shop"
            className="relative px-4 py-2 rounded-2xl bg-gradient-to-r
              from-white to-gray-100 text-gray-800 font-medium shadow-md shadow-black/10
              backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl
              hover:shadow-black/20 hover:-translate-y-0.5 hover:from-gray-100
              hover:to-white active:translate-y-0 active:shadow-md
              cursor-pointer focus:outline-none focus:ring-2
              focus:ring-gray-300 focus:ring-offset-2"
          >
            See All
          </Link>
        </div>

        {/* Right: Cards */}
        <div className="cards grid p-7 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center gap-4 w-full">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <OfferSkeleton key={i} />)
            : products.map((product) => (
                <div
                  onClick={() => navigate(`/shop/${product._id}`)}
                  key={product._id}
                  className="my-2 relative bg-[#E8DED3] rounded-2xl p-4 w-full sm:max-w-[230px] shadow-sm
                    hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
                >
                  <span className="absolute top-3 right-3 bg-[#1C120A]/80 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    {product.discountPercent}%
                  </span>

                  <div className="flex justify-center">
                    <img
                      src={`/api/images/${product.coverImage}`}
                      alt={product.title}
                      className="w-full h-40 lg:h-44 object-contain drop-shadow-sm"
                    />
                  </div>

                  <h4 className="mt-3 px-1 text-sm font-medium text-[#1C120A] leading-snug capitalize line-clamp-2">
                    {product.title}
                  </h4>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-col justify-center gap-1 items-start">
                      <p className="text-sm font-semibold text-[#1C120A] px-1">
                        ${product.price}
                      </p>
                      <p className="text-[10px] font-medium text-[#6B3F1D] bg-[#FFF3E6] px-2 py-0.5 rounded-full border border-[#F2D2B6] tracking-wide capitalize">
                        {product.category?.name}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="p-2 rounded-full bg-[#4F342F] shadow-sm transition-all duration-200 cursor-pointer flex-shrink-0"
                    >
                      <ShoppingCart className="text-[#E8DED3] w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </section>
    </>
  );
};

export default Offers;