import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import HomePage from "./Pages/HomePage.jsx";
import AddProduct from "./Admin/AddProduct.jsx";
import Products from "./Admin/Products.jsx";
import AdminLayout from "./Admin/AdminLayout.jsx";
import AddCategory from "./Admin/AddCategory.jsx";
import About from "./Pages/About.jsx";
import Register from './Pages/Register';
import Login from "./Pages/Login.jsx";
import { AuthProvider } from "./Auth/AuthContext.jsx"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminLayout />} >
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/add-category" element={<AddCategory />} />
            <Route index path="/admin/products" element={<Products />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);