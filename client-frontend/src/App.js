import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./containers/CartPage";
import ShopPage from "./containers/ShopPage";
import HomePage from "./containers/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./containers/LoginPage";
import RegisterPage from "./containers/RegisterPage";
import ClientProtectedRoute from "./components/ClientProtectedRoute";
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
              <ClientProtectedRoute>
                <Navigate to="/settings/profile" />
              </ClientProtectedRoute>
            }
          />
          <Route
            path="/settings/profile"
            element={
              <ClientProtectedRoute>
                <AccountDetails />
              </ClientProtectedRoute>
            }
          />
          <Route
            path="/settings/picture"
            element={
              <ClientProtectedRoute>
                <ProfilePicture />
              </ClientProtectedRoute>
            }
          />
          <Route
            path="/settings/privacy"
            element={
              <ClientProtectedRoute>
                <Privacy />
              </ClientProtectedRoute>
            }
          />
          <Route
            path="/settings/password"
            element={
              <ClientProtectedRoute>
                <PasswordChange />
              </ClientProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ClientProtectedRoute>
                <CartPage />
              </ClientProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ClientProtectedRoute>
                <ShopPage />
              </ClientProtectedRoute>
            }
          />
          <Route
            path="/shop/activity/:id"
            element={
              <ClientProtectedRoute>
                <ActivityDetailsPage />
              </ClientProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                loading={isLoading}
                error={clientError}
                title="Client Login"
                registerLink="/register"
                loginMethod={login}
              />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/vendor/login"
            element={
              <LoginPage title="Vendor Login" registerLink="/vendor/register" />
            }
          />
          <Route path="/vendor/register" element={<VendorRegisterPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
