
import { useState, useEffect } from "react"
import axios from "axios"
const Categories = () => {
  const [categories, setCategories] = useState([])


  // fetch categoriees
  const getCategories = async () => {
    const response = await axios.get(
      "http://localhost:5000/categories"
    );
    setCategories(response.data);
  };

  useEffect(() => {
    getCategories();
  }, []);



  return (
    <>
      {/* categories section */}
      <section className="bg-[#D7C8B6] py-12 px-6">

        <div className="grid grid-cols-2 sm:grid-cols-3 
        md:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="card flex flex-col items-center
               bg-[#FCF0E6] rounded-2xl shadow-md p-4
                hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={`http://localhost:5000/images/${cat.coverImage}`}
                alt={cat.name}
                className="w-20 h-20 mb-3"
              />
              <span className="text-[#4a3728] font-medium text-sm text-center">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

    </>)
}

export default Categories