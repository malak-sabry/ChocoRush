import { Link } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
import img from "../assets/almond chocolate.jpg";
import { useCart } from "../Auth/CartContext";

const Cart = () => {
const{setOpen,open} =useCart()
  return (
    <>
    

      {/* CART DRAWER */}
      <aside
        className={`
          fixed top-0 right-0 z-50
          w-[420px] h-screen
          bg-[#c0b5aa]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="relative flex justify-between items-center mx-4 my-6">
          <Link
            to="/"
            className="text-2xl header text-[#654433] font-semibold"
          >
            ChocoRush
          </Link>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="p-2 cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="cards">
          <div className="card border-b border-black/10 pb-6 mx-4">
            <div className="flex gap-4">
              {/* IMAGE */}
              <div className="bg-[#FFFBEB]/50 p-4 rounded-md shrink-0">
                <img
                  src={img}
                  className="w-20 h-20 object-contain"
                  alt="product-title"
                />
              </div>

              {/* DETAILS */}
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-medium">
                  Naturall vegan protein
                </h3>
                <p className="text-sm text-black/60">vanille</p>

                {/* QUANTITY */}
                <div className="mt-6">
                  <div className="flex items-center overflow-hidden w-fit rounded-lg border border-amber-200 bg-amber-50">
                    <button className="px-3 py-2 text-lg font-bold text-amber-800 hover:bg-amber-100 transition">
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-stone-800">
                      1
                    </span>
                    <button className="px-3 py-2 text-lg font-bold text-amber-800 hover:bg-amber-100 transition">
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* PRICE + DELETE */}
              <div className="flex flex-col items-end justify-between">
                <Trash2 className="w-6 h-6 text-black/40 cursor-pointer" />

                <div className="flex flex-col items-end mt-8">
                  <span className="text-sm font-extrabold text-amber-900">
                    $44.22
                  </span>
                  <span className="text-sm text-stone-500 line-through">
                    $55.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* CART FOOTER */}
<div className="mt-auto border-t border-black/10 p-6 bg-[#c0b5aa]">
  {/* SUBTOTAL */}
  <div className="flex justify-between text-sm text-black/70 mb-2">
    <span>Subtotal</span>
    <span>$44.22</span>
  </div>

  {/* SHIPPING */}
  <div className="flex justify-between text-sm text-black/70 mb-4">
    <span>Shipping</span>
    <span>$5.00</span>
  </div>

  {/* TOTAL */}
  <div className="flex justify-between items-center text-lg font-bold text-[#654433] mb-6">
    <span>Total</span>
    <span>$49.22</span>
  </div>

  {/* CHECKOUT BUTTON */}
  <Link
    to="/checkout"
    onClick={() => setOpen(false)}
    className="
      block w-full text-center
      bg-[#4F342F] text-[#E8DED3]
      py-3 rounded-full font-semibold
      hover:bg-[#7B3C34]
      transition-all duration-200
    "
  >
    Checkout
  </Link>
</div>
      </aside>
    </>
  );
};

export default Cart;