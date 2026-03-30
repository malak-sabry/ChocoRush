import { Link } from "react-router-dom";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../Auth/CartContext";

const Cart = () => {
  const { setOpen, open, cart, updateCart, removeFromCart } = useCart();
  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  const shipping = 5;
  const subtotal = !isEmpty
    ? cart.items.reduce(
        (sum, item) => sum + ((item.product?.price ?? 0) * item.quantity),
        0
      )
    : 0;
  const total = subtotal + shipping;

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* CART DRAWER */}
      <aside
        className={`
          fixed top-0 right-0 z-50
          w-full sm:w-[420px] h-screen
          bg-[#c0b5aa]
          flex flex-col
          transition-transform duration-300 ease-in-out
          will-change-transform
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="relative flex justify-between items-center mx-4 my-6">
          <Link to="/" className="text-2xl header text-[#654433] font-semibold">
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

        {/* EMPTY CART MESSAGE */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center flex-1 px-4">
            <ShoppingCart className="w-12 h-12 text-black/40 mb-3" />
            <p className="text-base font-medium text-[#654433]">
              Your Cart Is Empty
            </p>
          </div>
        )}

        {/* CART ITEMS */}
        {!isEmpty && (
          <>
            <div className="cards overflow-y-auto flex-1">
              {cart.items
                .filter((item) => item.product)
                .map((item) => {
                  const itemTotal = (
                    (item.product?.price ?? 0) * item.quantity
                  ).toFixed(2);

                  return (
                    <div
                      className="card border-b border-black/10 pb-6 mx-4 mt-4"
                      key={item._id}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* Product Image */}
                        <div className="bg-[#FFFBEB]/50 p-3 sm:p-4 rounded-md shrink-0">
                          <img
                            src={`/api/images/${item.product?.coverImage ?? "placeholder.jpg"}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                            alt={item.product?.title ?? "Product"}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-medium truncate">
                            {item.product?.title ?? "Deleted Product"}
                          </h3>
                          <p className="text-xs sm:text-sm text-black/60">
                            {item.product?.category?.name ?? "-"}
                          </p>

                          <div className="mt-3 sm:mt-6">
                            <div className="flex items-center overflow-hidden w-fit rounded-lg border border-amber-200 bg-amber-50">
                              <button
                                className="px-2 sm:px-3 py-1.5 sm:py-2 text-base sm:text-lg font-bold text-amber-800 disabled:opacity-40"
                                disabled={item.quantity <= 1}
                                onClick={() =>
                                  updateCart(item.product._id, item.quantity - 1)
                                }
                              >
                                −
                              </button>
                              <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                className="px-2 sm:px-3 py-1.5 sm:py-2 text-base sm:text-lg font-bold text-amber-800 disabled:opacity-40"
                                disabled={item.product?.stock === 0}
                                onClick={() =>
                                  updateCart(item.product._id, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price & Delete */}
                        <div className="flex flex-col items-end justify-between shrink-0">
                          <Trash2
                            className="w-5 h-5 sm:w-6 sm:h-6 text-black/40 cursor-pointer hover:text-red-500 transition-colors"
                            onClick={() => removeFromCart(item.product._id)}
                          />

                          <div className="flex flex-col items-end mt-4 sm:mt-8">
                            <span className="text-sm font-extrabold text-amber-900">
                              ${itemTotal}
                            </span>
                            <span className="text-xs text-stone-500">
                              ${item.product?.price ?? 0} × {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* CART FOOTER */}
            <div className="mt-auto border-t border-black/10 p-4 sm:p-6 bg-[#c0b5aa]">
              <div className="flex justify-between text-sm text-black/70 mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm text-black/70 mb-4">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-[#654433] mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-[#4F342F] text-[#E8DED3] py-3 rounded-full font-semibold hover:bg-[#7B3C34] transition-colors"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default Cart;