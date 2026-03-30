import { createContext, useContext, useEffect, useState } from "react"
import { toast } from 'react-toastify';

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [open, setOpen] = useState(false);

  useEffect(() => {
  fetch("/api/carts", { credentials: "include" })
    .then(res => res.json())
    .then(data => setCart(data.cart))
}, [])

  const addToCart = async (productId) => {
    const res = await fetch("/api/carts", {
      credentials: "include",
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    })
    const data = await res.json()
    setCart(data.cart)
  }

  const updateCart = async (productId, quantity) => {
    const res = await fetch("/api/carts", {
      credentials: "include",
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity })
    })
    const data = await res.json()
    if (data.message != null) {
      toast.error(data.message)
    } else {
      setCart(data.cart)
    }
  }

  const removeFromCart = async (productId) => {
    const res = await fetch(`/api/carts/${productId}`, {
      credentials: "include",
      method: 'DELETE',
    })
    const data = await res.json()
    setCart(data.cart)
  }



const clearCart = async () => {
  try {
    const res = await fetch("/api/carts", {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    setCart(data.cart);
  } catch (error) {
    console.error("Clear cart failed:", error);
  }
};

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCart,
      removeFromCart,
      clearCart,
      open,
      setOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)