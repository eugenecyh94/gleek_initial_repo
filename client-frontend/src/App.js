import React, { useState } from "react";
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
import ActivityDetailsPage from "./containers/ActivityDetailsPage";
import useClientStore from "./zustand/ClientStore";
import VendorRegisterPage from "./containers/Vendor/VendorRegisterPage";

function App() {
  const { isLoading, clientError, login } = useClientStore();
  return (
    <div>
      <SocketConnection />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Navigate to="/settings/profile" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <AccountDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/picture"
            element={
              <ProtectedRoute>
                <ProfilePicture />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/privacy"
            element={
              <ProtectedRoute>
                <Privacy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/password"
            element={
              <ProtectedRoute>
                <PasswordChange />
              </ProtectedRoute>
            }
          />

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
          <Route
            path="/shop/activity/:id"
            element={
              <ProtectedRoute>
                <ActivityDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/login"
            element={
              <LoginPage
                loading={isLoading}
                error={clientError}
                title="Client Login"
                registerlink="/client/register"
                loginMethod={login}
              />
            }
          />
          <Route path="/client/register" element={<RegisterPage />} />
          <Route
            path="/vendor/login"
            element={
              <LoginPage title="Vendor Login" registerlink="/vendor/register" />
            }
          />
          <Route path="/vendor/register" element={<VendorRegisterPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
