import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Auth/AuthContext"

function Products() {
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/products", {
          method: 'GET',
          credentials: "include",
          headers: { 'Content-Type': "application/json" }
        })
        if (res.status === 401 || res.status === 403) {
          setError("Not Authorized.")
          navigate("/", { replace: true })
          return
        }
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        setProductList(Array.isArray(data) ? data : [])
      } catch (error) {
        console.log("Error fetching products:", error);
        setError(error.message)
        navigate("/", { replace: true })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && isAdmin) {
      fetchProducts()
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate, isAuthenticated, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#c9b49a] border-t-[#4a3728] animate-spin" />
        <p className="text-[#8a6d5a] text-sm font-medium">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#4a3728]">All Products</h2>
        <p className="text-[#8a6d5a] text-sm mt-1">
          {productList.length} product{productList.length !== 1 ? "s" : ""} in your store
        </p>
      </div>

      {/* Success message */}
      {message && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-green-100 text-green-700 text-sm font-medium text-center">
          {message}
        </div>
      )}

      {/* Empty state */}
      {productList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[#e8d5c4] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#a07850]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
            </svg>
          </div>
          <p className="text-[#4a3728] font-medium">No products yet</p>
          <p className="text-[#8a6d5a] text-sm mt-1">Add your first product to get started</p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {productList.map((product) => (
          <a
            key={product._id}
            href={`/admin/edit-product/${product._id}`}
            className="group block"
          >
            <div className="bg-[#FCF0E6] rounded-2xl overflow-hidden border border-[#c9b49a]
              hover:shadow-md hover:border-[#a07850] transition-all duration-200">

              {/* Image */}
              <div className="aspect-square overflow-hidden bg-[#e8d5c4]">
                <img
                  src={`http://localhost:5000/images/${product.coverImage}`}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-1">
                <h6 className="text-[#4a3728] font-semibold text-sm leading-tight line-clamp-2">
                  {product.title}
                </h6>
                <span className="text-[#a07850] text-xs">
                  {product?.brand}
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[#4a3728] font-bold text-sm">
                    ${product?.price}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    product.stock > 10
                      ? "bg-green-100 text-green-700"
                      : product.stock > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {product.stock > 0 ? `${product.stock} left` : "Out"}
                  </span>
                </div>
              </div>

            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Products