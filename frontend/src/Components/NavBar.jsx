import { ShoppingCart, Heart, UserCircle } from "lucide-react";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from "../Auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../Auth/CartContext";
import { Menu, X } from "lucide-react"
import { useLocation } from 'react-router-dom'

const NavBar = () => {
  const { setOpen, open } = useCart()
  const [isNavOpen, setIsNavOpen] = useState(true)
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const { cart } = useCart()
  const links = [
    { name: "home", path: "/" },
    { name: "shop", path: "/shop" },
    { name: "contact us", path: "/contact" },
    { name: "about us", path: "/about" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    setIsNavOpen(false)
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [location.pathname])

  return (
    <>
      {/* Spacer: matches nav height on mobile and desktop */}
      <div className="h-[80px] md:h-[68px]" />

      <nav className="flex right-0 left-0 bg-[#ccbfb1]/70
       backdrop-blur-md backdrop-saturate-150
        fixed z-50 shadow-md top-0
        pt-4 flex-col md:flex-row px-4 justify-between items-center">
        <div className="md:w-[120px] w-full flex justify-between items-center">
          <div className="logo w-22">
            <a href="/">
              <img src={logo} className="w-30" />
            </a>
          </div>
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="md:hidden text-[#4F342F]"
            aria-label="Toggle navigation"
          >
            {isNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div
          className={`flex p-2 w-full md:flex-row flex-col 
            transition-all duration-300 ease-in-out
            md:overflow-visible md:max-h-none md:opacity-100
            ${isNavOpen
              ? "overflow-visible max-h-screen opacity-100"
              : "overflow-hidden max-h-0 opacity-0 md:pointer-events-auto pointer-events-none"
            }`}
        >
          {/* Center Nav Links */}
          <div className="center md:mb-0 mb-7 md:ms-[380px] md:me-[380px]">
            <ul className="md:w-[400px] flex md:flex-row flex-col justify-center items-center gap-6">
              {links.map(({ name, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `px-3 py-2 capitalize rounded-lg transition-all duration-300 ${isActive
                        ? "font-bold text-[#3c2521]"
                        : "font-normal text-[#6c494292] hover:text-[#4F342FCC]"
                      }`
                    }
                  >
                    {name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section */}
          <div className="right flex justify-center items-center gap-4">
            {!isAuthenticated ? (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#4F342F] cursor-pointer text-[#E8DED3] py-1 px-4 rounded-2xl 
                  ring-2 ring-[#4F342FCC] transition-all duration-500 ease-in-out capitalize
                  hover:bg-[#4F342FCC] hover:scale-104"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="ring-2 ring-[#4F342FCC] cursor-pointer text-[#4F342F] py-1 px-4 
                  rounded-2xl capitalize transition-all duration-500 ease-in-out
                  hover:bg-[#4F342FCC] hover:text-[#E8DED3] hover:scale-104"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {isAdmin ? (
                  <button
                    onClick={() => navigate("/admin/products")}
                    className="bg-[#4F342F] text-[#E8DED3] py-1 px-4 rounded-2xl whitespace-nowrap
                    ring-2 ring-[#4F342FCC] transition-all duration-500 ease-in-out capitalize
                    hover:bg-[#4F342FCC]"
                  >
                    Manage Dashboard
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {cart && cart.items?.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs rounded-full px-2 py-0.5">
                          {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      )}
                      <ShoppingCart
                        className="w-7 h-7 cursor-pointer text-[#4F342F]"
                        onClick={() => setOpen(true)}
                      />
                    </div>
                    <Heart
                      className="w-7 h-7 cursor-pointer text-[#4F342F]"
                      onClick={() => navigate("/shop/favorites")}
                    />
                  </div>
                )}

                {/* Profile Icon with Dropdown */}
                <div className="relative" ref={profileRef}>
                  <UserCircle
                    className="w-8 h-8 cursor-pointer text-[#4F342F] transition-all duration-300"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  />
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-[#DFCCB2] rounded-xl shadow-lg ring-1 ring-[#4F342F22] py-3 px-4 flex flex-col gap-3 z-50">
                      <span className="text-sm text-[#4F342F] font-medium border-b border-[#4F342F22] pb-2">
                        Welcome, {user?.name}
                      </span>
                      <button
                        onClick={() => { setIsProfileOpen(false); navigate("/profile") }}
                        className="text-left cursor-pointer text-sm text-[#4F342F] capitalize 
                        hover:font-medium transition-all duration-200"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => { setIsProfileOpen(false); handleLogout() }}
                        className="text-left cursor-pointer text-sm text-red-400 capitalize hover:font-medium transition-all duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;