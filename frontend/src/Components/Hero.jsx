import heroImg from "../assets/delicious_food.png";
import grainImg from "../assets/grains.png";
import { FaStar } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";



const Hero = () => {
  const products = [
    { id: 1, name: "Milk-filled chocolate", price: "$15.00", rating: "5.0" },
    { id: 2, name: "Dark chocolate bar", price: "$12.00", rating: "4.8" },
    { id: 3, name: "White chocolate delight", price: "$14.50", rating: "5.0" },
  ];

  return (
    <section className="relative min-h-screen ">
      {/* Hero Images */}
      <div className="hero relative mb-10">
        <img src={heroImg} className="w-1/2 mx-auto" />
        <img
          src={grainImg}
          alt="grains"
          className="absolute w-32 top-10 right-10"
        />
      </div>

      {/* Card Product */}
      <div className="flex justify-center items-center px-6">
        <div className="flex items-center justify-center">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`
        flex flex-col items-center text-center shadow-lg rounded-full mx-5 transition-all
        ${!(i % 2 == 0)
                  ? "w-[420px] bg-[#1C120A] text-[#E8DED3] py-14 px-6"
                  : "w-[320px] bg-[#968C82] text-[#E8DED3] py-5 px-3"}
      `}
            >
              <h3 className={`text-lg font-semibold ${!!(i % 2 == 0) && 'text-[#2E1F1B]'}`}>
                {product.name}
              </h3>

              <p className={`${!(i % 2 == 0) ? 'text-[#E8DED3]' : 'text-[#3E2A25]'} font-medium mt-1`}>
                {product.price}
              </p>

              <span className="mt-2 flex items-center gap-2 bg-[#DED7DA]/40 px-3 py-1 rounded-full shadow">
                <span className="text-sm font-medium">{product.rating}</span>
                <FaStar className="text-yellow-300/70" />
              </span>

              <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#D9CCBE] rounded-full shadow hover:bg-[#cbbca9] transition text-[#4F342F] font-medium cursor-pointer">
                Add To Cart
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;