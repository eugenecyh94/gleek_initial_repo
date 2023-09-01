import React from "react";
import { Routes, Route } from "react-router-dom";
import CartPage from "./containers/CartPage";
import ShopPage from "./containers/ShopPage";
import HomePage from "./containers/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./containers/LoginPage";
import RegisterPage from "./containers/RegisterPage";

function App() {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
