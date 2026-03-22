import { useEffect, useState } from 'react'

function Products() {

  const [productList, setProductList] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProductList(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);




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
<img src={`http://localhost:5000/images/${product.coverImage}` }/>
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