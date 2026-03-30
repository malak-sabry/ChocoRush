import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './Auth/ProtectedRoute.jsx';

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
import Categories from "./Admin/Categories.jsx";
import UpdateProduct from "./Admin/UpdateProduct.jsx";
import UpdateCategory from "./Admin/UpdateCategory.jsx";

// Context Providers
import { AuthProvider } from "./Auth/AuthContext.jsx";
import { CartProvider } from "./Auth/CartContext.jsx";

// Toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from "./Pages/Checkout.jsx";
import Orders from "./Admin/Orders.jsx";
import UserProfile from "./Pages/UserProfile.jsx";
import CategoryProducts from "./Pages/CategoryProducts.jsx";
import NotFound from "./Pages/NotFound.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        theme='dark'
        closeOnClick
        pauseOnHover
        draggable
      />

      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/category/:categoryId" element={<CategoryProducts />} />

            {/* Shop Pages */}
            <Route path="/shop" element={<ProductGrid />} />
            {/* favorites قبل :id عشان ميتعرفش كـ parameter */}
            <Route path="/shop/favorites" element={
              <ProtectedRoute><Favourites /></ProtectedRoute>
            } />
            <Route path="/shop/:id" element={<ProductPage />} />

            {/* Protected Pages */}
            <Route path="/checkout" element={
              <ProtectedRoute><Checkout /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><UserProfile /></ProtectedRoute>
            } />

            {/* Admin Pages */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:id" element={<UpdateProduct />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:id" element={<UpdateCategory />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);