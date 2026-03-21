import Hero from '../Components/Hero'
import Layout from '../Components/Layout'
import hazelnut from "../assets/hazelnut.png"
import white from "../assets/white.png"
import dark from "../assets/dark.png"
import sweet from "../assets/sweet.png"
import truffle from "../assets/truffle.png"
import strawberry from "../assets/strawberry.png"
import { Truck, RefreshCcw, Headphones } from "lucide-react";
const HomePage = () => {
  const categories = [
    { label: "Dark", image: dark },
    { label: "White", image: white },
    { label: "Sweet", image: sweet },
    { label: "Strawberry", image: strawberry },

    { label: "Hazel Nuts", image: hazelnut },
    { label: "Truffle", image: truffle },
  ]
 
 
// Service data defined BEFORE the component that uses it
const services = [
  {
    id: 1,
    icon: <Truck className="w-8 h-8 text-[#5C3D2E]" />,
    title: "Free Delivery Over $10",
  },
  {
    id: 2,
    icon: <RefreshCcw className="w-8 h-8 text-[#5C3D2E]" />,
    title: "Money Back Guarantee",
  },
  {
    id: 3,
    icon: <Headphones className="w-8 h-8 text-[#5C3D2E]" />,
    title: "Online Support 24/7",
  },
];
  return (
    <Layout>
      <Hero />
      <section className="bg-[#D7C8B6] py-12 px-6">
        
        <div className="grid grid-cols-2 sm:grid-cols-3 
        md:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="card flex flex-col items-center
               bg-[#FCF0E6] rounded-2xl shadow-md p-4
                hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-20 h-20 mb-3"
              />
              <span className="text-[#4a3728] font-medium text-sm text-center">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
       <section className="w-full py-16 px-8 bg-[#E8DED3]">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#1C120A] mb-3">
          Chocolate Delights & Services
        </h2>
        <p className="text-[#7A6A60] text-base max-w-xl mx-auto leading-relaxed">
          We love creating delicious moments that become unforgettable memories.
          From handcrafted chocolates to custom packaging, we are here for you.
        </p>
      </div>
 
      {/* Service Cards */}
      <div className="flex justify-center gap-6 flex-wrap">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-[#FAF0E6] rounded-2xl p-8 flex flex-col items-center text-center gap-4 w-72 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-16 h-16 rounded-full border-2 border-[#C9B8AD] flex items-center justify-center">
              {service.icon}
            </div>
            <p className="text-[#1C120A] font-semibold text-sm">{service.title}</p>
          </div>
        ))}
      </div>
    </section>
    </Layout>
  )
}

export default HomePage