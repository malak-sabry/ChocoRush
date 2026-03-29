import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from './../Components/Layout';

const API_BASE = "http://localhost:5000";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/favourites`, {
          withCredentials: true,
        });
        // Filter out any favourites with null productId
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
    // Optimistic UI update
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
      // Revert to previous state on failure
      setFavourites(previous);
    }
  };

  if (loading) return <p className="text-center pt-10">Loading favourites...</p>;
  if (error) return <p className="text-center pt-10 text-red-600">{error}</p>;

  return (
    <Layout>
      <div className="w-[70%] mx-auto pt-10 mb-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between">
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
                px-6 py-3 w-fit
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
                  className="flex mb-6 items-center gap-6 p-5 border rounded-xl
                  bg-[#E3D0B5] shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/shop/${item.productId._id}`)}
                >
                  <img
                    src={`${API_BASE}/images/${item.productId.coverImage}`}
                    alt={item.productId.title}
                    className="w-24 h-24 object-cover rounded-md border"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.productId.title}
                    </h2>
                    <p className="mt-1 text-[#7B3C34] font-bold text-base">
                      ${item.productId.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(item.productId._id); }}
                      className="p-2 transition active:scale-90"
                      title="Remove from favourites"
                    >
                      <Heart size={25} fill="#4F342F" className="text-[#4F342F]" />
                    </button>
                    <button className="p-2 rounded-full bg-[#4F342F] shadow-sm transition-all duration-200">
                      <ShoppingCart className="text-[#E8DED3] w-4 h-4" />
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