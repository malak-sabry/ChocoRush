import { FaUserCircle } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";

import logo from "../assets/logo.png";
import { useState } from "react";
const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const links = ["home", "all products", "contact us", "about us"];

  return (
    <>
      <nav className="flex px-4 justify-between items-center">
        <div className="left flex justify-center items-center">
          <div className="logo">
            <img src={logo} className="w-24" />
          </div>
          <div className="btns flex gap-4">
            <button
              className="bg-[#4F342F] cursor-pointer
    text-[#E8DED3] py-1 px-4 rounded-2xl 
    ring-2 ring-[#4F342FCC]
    transition-all duration-500 ease-in-out capitalize
    hover:bg-[#4F342FCC] hover:scale-104"
            >
              Login
            </button>

            <button
              className="ring-2 ring-[#4F342FCC] cursor-pointer
    text-[#4F342F] py-1 px-4 rounded-2xl capitalize
    transition-all duration-500 ease-in-out
    hover:bg-[#4F342FCC] hover:text-[#E8DED3] hover:scale-104"
            >
              Register
            </button>
          </div>
        </div>

        <div className="center">
          <ul className="flex justify-center items-center gap-6">
            {links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  onClick={() => setActiveLink(link)}
                  className={`px-3 py-2 capitalize rounded-lg transition-all duration-300 ${
                    activeLink === link
                      ? "font-bold text-[#4F342FCC]"
                      : "font-normal text-[#6c494292] hover:text-[#4F342FCC]"
                  }`}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="right flex justify-center items-center  gap-6">
          <ShoppingCart className="w-7.5 h-7.5 cursor-pointer text-[#4F342F]" />
          <FaUserCircle className="w-7.5 h-7.5 cursor-pointer text-[#4F342F]" />
        </div>
      </nav>
    </>
  );
};

export default NavBar;
