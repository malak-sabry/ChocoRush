import { ShoppingCart, Heart, UserCircle } from "lucide-react";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from "../Auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../Auth/CartContext";

const NavBar = () => {
  const { setOpen, open } = useCart()

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

  }, [])

  return (
    <nav className="flex px-4 justify-between items-center">
      <div className="logo">
        <a href="/">
          <img src={logo} className="w-30" />
        </a>
      </div>

      <div className="center">
        <ul className="flex justify-center items-center gap-6">
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
                hover:bg-[#4F342FCC] "
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
                    onClick={() => setOpen(true)} />
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
                className="w-8 h-8 cursor-pointer text-[#4F342F]
                 transition-all duration-300 "
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              />
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#DFCCB2] rounded-xl shadow-lg ring-1 ring-[#4F342F22] py-3 px-4 flex flex-col gap-3 z-50">
                  <span className="text-sm text-[#4F342F] font-medium border-b border-[#4F342F22] pb-2">
                    Welcome, {user?.name}
                  </span>
                  <button
                    onClick={() => { setIsProfileOpen(false); navigate("/profile") }}
                    className="text-left text-sm text-[#4F342F] capitalize 
                    hover:font-medium transition-all duration-200"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { setIsProfileOpen(false); handleLogout() }}
                    className="text-left text-sm text-red-400 capitalize hover:font-medium transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;