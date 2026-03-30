import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const BASE_URL = "/api"

  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load categories:", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="min-h-screen px-4 py-10 bg-[#fdf6ee]">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#4a3728]">Categories</h1>
          <p className="text-[#8a6d5a] text-sm mt-2">
            Click any category to edit or delete it
          </p>
        </div>

        {loading ? (
          <p className="text-center text-[#8a6d5a] text-sm">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-[#8a6d5a] text-sm">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => navigate(`/admin/categories/${cat._id}`)}
                className="group relative rounded-2xl overflow-hidden shadow-md
                  border-2 border-transparent hover:border-[#c9b49a]
                  hover:scale-[1.02] transition duration-200 text-left"
              >
                <div className="w-full h-36 bg-[#f0e0cc]">
                  {cat.coverImage ? (
                    <img
                      src={`${BASE_URL}/images/${cat.coverImage}`}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#c9b49a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 4.5h18A.75.75 0 0121.75 5.25v13.5A.75.75 0 0121 19.5H3A.75.75 0 012.25 18.75V5.25A.75.75 0 013 4.5z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="px-3 py-2.5 bg-white">
                  <p className="text-[#4a3728] font-semibold text-sm truncate">{cat.name}</p>
                </div>

                <div className="absolute inset-0 bg-[#4a3728]/10 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none" />
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

export default Categories