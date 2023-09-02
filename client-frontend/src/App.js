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
import PasswordChange from "./containers/Account/PasswordChange";
import BillingChange from "./containers/Account/BillingChange";

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
          <Route path="/settings/profile" element={<AccountDetails />} />
          <Route path="/settings/privacy" element={<Privacy />} />
          <Route path="/settings/password" element={<PasswordChange />} />
          <Route path="/settings/billing" element={<BillingChange />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
