import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Global CSS
import "./index.css";

// Pages
import HomePage from "./Pages/HomePage.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Register from './Pages/Register';
import Login from "./Pages/Login.jsx";
import ProductGrid from "./Pages/ProductGrid.jsx";
import Favourites from "./Pages/Favourites.jsx";
import ProductPage from "./Pages/ProductPage.jsx";

// Admin Pages & Layout
import AdminLayout from "./Admin/AdminLayout.jsx";
import AddProduct from "./Admin/AddProduct.jsx";
import AddCategory from "./Admin/AddCategory.jsx";
import Products from "./Admin/Products.jsx";

// Context Providers
import { AuthProvider } from "./Auth/AuthContext.jsx";
import { CartProvider } from "./Auth/CartContext.jsx";

// Toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Root render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Toast notifications for user feedback */}
      <ToastContainer
        position="top-right"
        autoClose={2000}  // disappears after 2 seconds
        hideProgressBar={true}
        newestOnTop={false}
        theme='dark'
        closeOnClick
        pauseOnHover
        draggable
      />

      {/* Context providers for authentication and cart state */}
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ProductGrid />} />
            <Route path="/shop/:id" element={<ProductPage />} />
            <Route path="/shop/favorites" element={<Favourites />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Pages - Nested under AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="add-product" element={<AddProduct />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="products" element={<Products />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);