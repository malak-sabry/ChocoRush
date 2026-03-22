import hazelnut from "../assets/hazelnut.png"
import white from "../assets/white.png"
import dark from "../assets/dark.png"
import sweet from "../assets/sweet.png"
import truffle from "../assets/truffle.png"
import strawberry from "../assets/strawberry.png"
const Categories = () => {
    const categories = [
    { label: "Dark", image: dark },
    { label: "White", image: white },
    { label: "Sweet", image: sweet },
    { label: "Strawberry", image: strawberry },

    { label: "Hazel Nuts", image: hazelnut },
    { label: "Truffle", image: truffle },
  ]
  return (
    <>
      {/* categories section */}
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

    </>)
}

export default Categories