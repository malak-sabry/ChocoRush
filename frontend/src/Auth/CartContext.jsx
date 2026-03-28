import { createContext, useContext, useEffect, useState } from "react"
const CartContext = createContext()



export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [open, setOpen] = useState(false);



  useEffect(() => {
    fetch("http://localhost:5000/carts", {
      credentials: "include"
    })
      .then(res => res.json()).then(data => setCart(data.cart))

  }, [])





  const addToCart = async (productId) => {
    const res = await fetch("http://localhost:5000/carts", {
      credentials: "include",
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId })

    })
    const data = await res.json()
    setCart(data.cart)
  }
  const updateCart = async (productId, quantity) => {
    const res = await fetch("http://localhost:5000/carts",
      {
        credentials: "include",
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId, quantity })
      })
    const data = await res.json()
    setCart(data.cart)
  }


  const removeFromCart = async (productId) => {
    const res = await fetch(`http://localhost:5000/carts/${productId}`, {
      credentials: "include",
      method: 'DELETE',
    })
    const data = await res.json()
    setCart(data.cart)
  }


  return (
    <>
      <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart, open, setOpen }}>
        {children}
      </CartContext.Provider>    </>
  )

}

export const useCart = () => useContext(CartContext)