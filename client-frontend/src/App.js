import React from "react";
import { Routes, Route } from "react-router-dom";
import CartPage from "./containers/CartPage";
import ShopPage from "./containers/ShopPage";
import HomePage from "./containers/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./containers/LoginPage";
import RegisterPage from "./containers/RegisterPage";
import AccountDetails from "./containers/Account/AccountDetails";
import Privacy from "./containers/Account/Privacy";

function App() {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Cart" element={<CartPage />} />
          <Route path="/Shop" element={<ShopPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Register" element={<RegisterPage />} />
          <Route path="/settings/profile" element={<AccountDetails />} />
          <Route path="/settings/privacy" element={<Privacy />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
