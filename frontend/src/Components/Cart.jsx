import { Link } from "react-router-dom";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../Auth/CartContext";

const Cart = () => {
  const { setOpen, open, cart, updateCart, removeFromCart } = useCart();
  const isEmpty = !cart || cart.items.length === 0;

  const shipping = 5;
  const subtotal = !isEmpty
    ? cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : 0;
  const total = subtotal + shipping;

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
          <div className="flex flex-col items-center justify-center flex-1">
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
              {cart?.items.map((item) => {
                const itemTotal = (item.product.price * item.quantity).toFixed(2);

                return (
                  <div
                    className="card border-b border-black/10 pb-6 mx-4 mt-4"
                    key={item._id}
                  >
                    <div className="flex gap-4">
                      <div className="bg-[#FFFBEB]/50 p-4 rounded-md shrink-0">
                        <img
                          src={`http://localhost:5000/images/${item?.product?.coverImage}`}
                          className="w-20 h-20 object-contain"
                          alt={item.product.title}
                        />
                      </div>

                      <div className="flex flex-col flex-1">
                        <h3 className="text-lg font-medium">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-black/60">
                          {item?.product?.category?.name}
                        </p>

                        <div className="mt-6">
                          <div className="flex items-center overflow-hidden w-fit rounded-lg border border-amber-200 bg-amber-50">
                            <button
                              className="px-3 py-2 text-lg font-bold text-amber-800 disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateCart(item.product._id, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span className="w-10 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              className="px-3 py-2 text-lg font-bold text-amber-800"
                              onClick={() =>
                                updateCart(item.product._id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Trash2
                          className="w-6 h-6 text-black/40 cursor-pointer hover:text-red-500 transition-colors"
                          onClick={() => removeFromCart(item.product._id)}
                        />

                        <div className="flex flex-col items-end mt-8">
                          <span className="text-sm font-extrabold text-amber-900">
                            ${itemTotal}
                          </span>
                          <span className="text-xs text-stone-500">
                            ${item.product.price} × {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CART FOOTER */}
            <div className="mt-auto border-t border-black/10 p-6 bg-[#c0b5aa]">
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
                className="block w-full text-center bg-[#4F342F] text-[#E8DED3] py-3 rounded-full font-semibold hover:bg-[#7B3C34]"
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