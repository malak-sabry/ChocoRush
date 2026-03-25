import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Auth/AuthContext"
function Products() {

  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");  
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, user } = useAuth()
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/products", {
          method: 'GET',
          credentials: "include",

          headers: {
            'Content-Type': "application/json"
          }

        }
        )
        if (res.status === 401 || res.status === 403) {
          setError("Not Authorized.")
          navigate("/", { replace: true })
          return
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setProductList(Array.isArray(data) ? data : [])
      }

      catch (error) {
        console.log("Error fetching products :", error);
        setError(error.message)
        navigate("/", { replace: true })

      }
      finally {
        setLoading(false)
      }

    }
    if (isAuthenticated && isAdmin) {
      fetchProducts()
    } else {
      console.log('Not authenticated or not admin')
      navigate("/", { replace: true });
    }
  }, [navigate,isAuthenticated,isAdmin]);


if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error}</div>
    }

  return (
    <div className='mt-10'>
      <h3 className='my-6'>All Products</h3>
      {message && (
        <div className="mb-4 p-3 rounded
         bg-green-100 text-green-700 text-center">
          {message}
        </div>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6  '>
        {productList.map((product) => (
          <div key={product._id} className='flex flex-col 
          items-center  p-4 rounded-lg'>
            <img src={`http://localhost:5000/images/${product.coverImage}`} />
            <h6 className='text-center my-3'>{product.title}</h6>
            <span className='text-gray-400'>{product?.brand}</span>
            <strong className='text-[#F86D72]'>{product?.price}
              $</strong>

            <div className='text-sm text-gray-500'>Stock: {product.stock}

            </div>

          </div>

        ))}
      </div>
    </div>
  )
}

export default Products