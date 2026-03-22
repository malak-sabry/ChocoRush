import { ShoppingCart } from "lucide-react";
import img from "../assets/almond chocolate.jpg"
import axios from "axios"
import { useState } from "react";
import { useEffect } from "react";

const Offers = () => {
  const [products, setProducts] = useState([])
  const [catetogies, setCategories] = useState([])
  // fetch products
  const getProducts = async () => {
    const response = await axios.get("http://localhost:5000/products")
    setProducts(response.data)
  }
  // fetch categoriees
  const getCategories = async () => {
    const response = await axios.get(
      "http://localhost:5000/categories"
    );
    // console.log(response.data)
    setCategories(response.data);
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  return (
  
    <>
      <section className="flex card bg-[#1C120A]/80 rounded-xl ">
        <div className=" flex justify-center items-center flex-col
      gap-4 p-9">
          <h3
            className="
    text-lg md:text-xl
    font-semibold
    tracking-wide
    text-[#F5EDE3]

    relative inline-block
    after:absolute after:-bottom-1 after:left-0
    after:h-[2px] after:w-1/3
    after:bg-[#C9A66B]
    after:rounded-full
  "
          >
            Special Offers
          </h3>
          <button className="relative px-4 py-2  rounded-2xl bg-gradient-to-r
 from-white to-gray-100  text-gray-800 font-medium shadow-md shadow-black/10
   backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl
    hover:shadow-black/20 hover:-translate-y-0.5 hover:from-gray-100
     hover:to-white active:translate-y-0 active:shadow-md
cursor-pointer focus:outline-none focus:ring-2
 focus:ring-gray-300 focus:ring-offset-2">See All</button>
        </div>
        <div className="cards grid grid-cols-5 justify-center items-center gap-6">
          {products.map((product) => 
            <div
              className=" my-6 relative
    bg-[#E8DED3]
    rounded-2xl
    p-4
    w-[230px]
    shadow-sm hover:shadow-md
    transition-all duration-300 ease-out
    hover:-translate-y-1
  "
            >
              {/* Discount badge */}
              <span
                className="
      absolute top-3 right-3
      bg-[#1C120A]/80
      text-white text-xs font-semibold
      px-2 py-1
      rounded-md
    ">{product.discountPercent}%</span>
              {/* Product image */}
              <div className="flex justify-center">
                <img
                  src={`http://localhost:5000/images/${product.coverImage}`}
                  alt={product.title}
                  className="
        h-[140px] w-[140px]
        object-contain
        drop-shadow-sm
      "
                />
              </div>

              {/* Product title */}
              <h4
                className="
      mt-3 px-2
      text-sm
      font-medium
      text-[#1C120A]
      leading-snug
      capitalize
    "
              >{product.title}
              </h4>

              {/* Price + cart */}
              <div className="mt-3 flex items-center justify-between ">
                <div className="flex flex-col justify-center gap-1 items-start">
<p className="text-sm font-semibold text-[#1C120A] px-2">
                  ${product.price}
                </p>
                {/* category */}
                <p className="
  text-[11px]
  font-medium
  text-[#6B3F1D]
  bg-[#FFF3E6]
  px-2
  py-0.5
  rounded-full
  border
  border-[#F2D2B6]
  tracking-wide
  capitalize
">
  {product.category?.name}
</p>
                </div>
                

                <button
                  className="p-2 rounded-full  bg-[#4F342F]  shadow-sm
        transition-all duration-200 cursor-pointer">
                  <ShoppingCart className="text-[#E8DED3] w-4 h-4 " />
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </>)
}

export default Offers