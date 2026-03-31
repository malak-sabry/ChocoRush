import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategorySkeleton = () => (
  <div className="flex flex-col items-center bg-[#FCF0E6] rounded-2xl shadow-md p-4">
    {/* Circle skeleton */}
    <div className="w-20 h-20 mb-3 rounded-full bg-[#D7C8B6] relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#e8ddd2]/60 to-transparent" />
    </div>
    {/* Text skeleton */}
    <div className="w-14 h-3 rounded-full bg-[#D7C8B6] relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s] bg-gradient-to-r from-transparent via-[#e8ddd2]/60 to-transparent" />
    </div>
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {/* Inject shimmer keyframe globally */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <section className="bg-[#D7C8B6] py-12 px-6" id="categories">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-[#4a3728] text-xl font-semibold mb-2">
              No Categories Available
            </h2>
            <p className="text-[#7a6355] text-sm">
              Check back later — new categories will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <Link key={cat._id} to={`/category/${cat._id}`}>
                <div className="flex flex-col items-center bg-[#FCF0E6] rounded-2xl shadow-md p-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <img
                    src={`/api/images/${cat.coverImage}`}
                    alt={cat.name}
                    className="w-20 h-20 mb-3 rounded-full object-cover"
                  />
                  <span className="text-[#4a3728] font-medium text-sm text-center">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Categories;