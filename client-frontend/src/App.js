import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./containers/Client/CartPage";
import ShopPage from "./containers/Client/ShopPage";
import HomePage from "./containers/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./containers/LoginPage";
import RegisterPage from "./containers/Client/RegisterPage";
import ClientProtectedRoute from "./components/Routes/ClientProtectedRoute";
import SocketConnection from "./utils/SocketConnection";
import AccountDetails from "./containers/Account/AccountDetails";
import Privacy from "./containers/Account/Privacy";
import PasswordChange from "./containers/Account/PasswordChange";
import ProfilePicture from "./containers/Account/ProfilePicture";
import VerifyEmail from "./containers/Account/VerifyEmail";
import ActivityDetailsPage from "./containers/ActivityDetailsPage";
import useClientStore from "./zustand/ClientStore";
import VendorRegisterPage from "./containers/Vendor/VendorRegisterPage";
import ErrorPage from "./containers/ErrorPage";
import useVendorStore from "./zustand/VendorStore";
import VendorProtectedRoute from "./components/Routes/VendorProtectedRoute";
import ActivitiesPage from "./containers/Vendor/ActivitiesPage";

function App() {
  const { isLoading, clientError, login } = useClientStore();
  const { isLoadingVendor, vendorError, loginVendor } = useVendorStore();
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
            path="/client/verifyEmail/:token"
            element={
              <ClientProtectedRoute>
                <VerifyEmail />
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
              <LoginPage
                loading={isLoadingVendor}
                error={vendorError}
                title="Vendor Login"
                registerLink="/vendor/register"
                loginMethod={loginVendor}
              />
            }
          />
          <Route path="/vendor/register" element={<VendorRegisterPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route
            path="/vendor/activities"
            element={
              <VendorProtectedRoute>
                <ActivitiesPage />
              </VendorProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
