import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./containers/CartPage";
import ShopPage from "./containers/ShopPage";
import HomePage from "./containers/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./containers/LoginPage";
import RegisterPage from "./containers/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SocketConnection from "./utils/SocketConnection";
import AccountDetails from "./containers/Account/AccountDetails";
import Privacy from "./containers/Account/Privacy";
import PasswordChange from "./containers/Account/PasswordChange";
import ProfilePicture from "./containers/Account/ProfilePicture";

function App() {
  return (
    <div>
      <SocketConnection />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/settings"
            element={<Navigate to="/settings/profile" />}
          />
          <Route path="/settings/profile" element={<AccountDetails />} />
          <Route path="/settings/picture" element={<ProfilePicture />} />
          <Route path="/settings/privacy" element={<Privacy />} />
          <Route path="/settings/password" element={<PasswordChange />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
