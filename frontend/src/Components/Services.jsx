import { Truck, RefreshCcw, Headphones } from "lucide-react";

const Services = () => {

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
  return (<>
    {/* services section */}
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
  </>

  )
}

export default Services