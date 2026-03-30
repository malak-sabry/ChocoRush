import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from './../Components/Layout';
import { useCart } from '../Auth/CartContext';
import { toast } from "react-toastify";

const API_BASE = "/api";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/favourites`, {
          withCredentials: true,
        });
        setFavourites(res.data.filter(item => item.productId));
      } catch (err) {
        setError("Failed to load favourite items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const handleRemove = async (productId) => {
    const previous = favourites;
    setFavourites(prev => prev.filter(item => item.productId._id !== productId));
    try {
      await axios.post(
        `${API_BASE}/products/favourites`,
        { productId },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to remove favourite:", err.message);
      setFavourites(previous);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      await addToCart(productId);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) return <p className="text-center pt-10">Loading favourites...</p>;
  if (error) return <p className="text-center pt-10 text-red-600">{error}</p>;

  return (
    <Layout>
      <div className="w-[92%] sm:w-[80%] lg:w-[70%] mx-auto pt-10 mb-4">
        <div className="space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="
              text-2xl font-semibold tracking-wide text-black
              relative inline-block
              after:absolute after:-bottom-1 after:left-0
              after:h-0.5 after:w-1/3
              after:bg-[#C9A66B] after:rounded-full
            ">
              Favourite Items
            </h3>

            <Link
              to="/shop"
              className="
                inline-flex items-center justify-center gap-2
                px-5 py-2.5 w-fit
                rounded-full
                bg-[#4F342F] text-[#E8DED3]
                text-sm font-semibold
                shadow-sm
                hover:bg-[#573b38]
                hover:shadow-md
                active:scale-95
                transition-all duration-200
              "
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </div>

          {/* Empty state */}
          {favourites.length === 0 && (
            <p className="text-gray-500">No favourite items found.</p>
          )}

          {/* Favourite cards */}
          <div className="space-y-4">
            {favourites.map(item => (
              item.productId && (
                <div
                  key={item._id}
                  className="flex items-center gap-3 sm:gap-6 p-4 sm:p-5 border rounded-xl
                  bg-[#E3D0B5] shadow-sm hover:shadow-md transition cursor-pointer mb-6"
                  onClick={() => navigate(`/shop/${item.productId._id}`)}
                >
                  {/* Image */}
                  <img
                    src={`${API_BASE}/images/${item.productId.coverImage}`}
                    alt={item.productId.title}
                    className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-md border shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
                      {item.productId.title}
                    </h2>
                    <p className="mt-1 text-[#7B3C34] font-bold text-sm sm:text-base">
                      ${item.productId.price}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                    {/* Heart / Remove */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(item.productId._id); }}
                      className="group p-2 transition active:scale-90"
                      title="Remove from favourites"
                    >
                      <Heart
                        size={22}
                        fill="#7B3C34"
                        stroke="#7B3C34"
                        className="cursor-pointer
                        
                          group-hover:fill-[#4F342F]
                          group-hover:stroke-[#4F342F]
                        
                      
                        "
                      />
                    </button>

                    {/* Add to Cart */}
                    <button
                      onClick={(e) => {
                        handleAddToCart(e, item.productId._id);
                        toast.success("Added To Cart Successfully!");
                      }}
                      disabled={addingToCart[item.productId._id]}
                      className=" cursor-pointer
                        flex items-center gap-1.5
                        px-3 py-2 rounded-full
                        bg-[#4F342F] text-[#E8DED3]
                        text-xs font-semibold
                        shadow-sm
                        hover:bg-[#7B3C34]
                        hover:shadow-md
                        active:scale-95
                        disabled:opacity-60 disabled:cursor-not-allowed
                        transition-all duration-200
                      "
                      title="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4 cursor-pointer" />
                      <span className="hidden sm:inline">
                        {addingToCart[item.productId._id] ? "Adding..." : "Add"}
                      </span>
                    </button>

                  </div>
                </div>
              )
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Favourites;