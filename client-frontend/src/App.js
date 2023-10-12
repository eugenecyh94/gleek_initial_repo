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
import AccountDetails from "./containers/Client/Account/AccountDetails";
import Privacy from "./containers/Client/Account/Privacy";
import PasswordChange from "./containers/Client/Account/PasswordChange";
import ProfilePicture from "./containers/Client/Account/ProfilePicture";
import VerifyEmail from "./containers/Client/Account/VerifyEmail";
import MyBookmarks from "./containers/Client/Bookmark/MyBookmarks";
import ActivityDetailsPage from "./containers/ActivityDetailsPage/ActivityDetailsPage";
import CheckoutPage from "./containers/Client/CheckoutPage";

import useClientStore from "./zustand/ClientStore";
import VendorRegisterPage from "./containers/Vendor/VendorRegisterPage";
import ErrorPage from "./containers/ErrorPage";
import useVendorStore from "./zustand/VendorStore";
import VendorProtectedRoute from "./components/Routes/VendorProtectedRoute";
import ActivitiesPage from "./containers/Vendor/Activity/ActivitiesPage";
import AccountDetailsVendor from "./containers/Vendor/AccountDetailsVendor";
import ProfilePictureVendor from "./containers/Vendor/ProfilePictureVendor";
import PasswordChangeVendor from "./containers/Vendor/PasswordChangeVendor";
import ResetPassword from "./containers/Client/Password/ResetPassword";
import ForgotPassword from "./containers/Client/Password/ClientForgotPassword";
import VerifyEmailVendor from "./containers/Vendor/VerifyEmailVendor";
import PrivacyVendor from "./containers/Vendor/PrivacyVendor";
import VendorForgotPassword from "./containers/Vendor/Password/VendorForgotPassword";
import VendorResetPassword from "./containers/Vendor/Password/ResetPassword";
import VendorDetails from "./containers/Client/Activity/VendorDetails";
import BlockoutDashboard from "./containers/Vendor/Blockout/BlockoutDashboard";
import BlockoutMultipleActivities from "./containers/Vendor/Blockout/BlockoutMultipleActivities";
import CreateActivityPage from "./containers/Vendor/Activity/CreateActivityPage";
import EditActivityDraftPage from "./containers/Vendor/Activity/EditActivityDraftPage";
import BlockoutSingleActivity from "./containers/Vendor/Blockout/BlockoutSingleActivity";

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
            path="/client/verifyEmail"
            element={
              <ClientProtectedRoute>
                <VerifyEmail />
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
            path="/bookmarks"
            element={
              <ClientProtectedRoute>
                <MyBookmarks />
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
            path="/shop/activity/:activityId"
            element={
              <ClientProtectedRoute>
                <ActivityDetailsPage />
              </ClientProtectedRoute>
            }
          />
          <Route
            exact
            path="/shop/vendor/:id"
            element={
              <ClientProtectedRoute>
                <VendorDetails />
              </ClientProtectedRoute>
            }
          />
          <Route
            exact
            path="/cart/checkout"
            element={
              <ClientProtectedRoute>
                <CheckoutPage />
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
                forgotPasswordLink="/client/forgotPassword"
                loginMethod={login}
              />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            exact
            path="client/resetPassword"
            element={<ResetPassword />}
          />
          <Route
            exact
            path="/client/forgotPassword"
            element={<ForgotPassword />}
          />

          {/* Vendor routes */}
          <Route
            path="/vendor/login"
            element={
              <LoginPage
                loading={isLoadingVendor}
                error={vendorError}
                title="Vendor Login"
                registerLink="/vendor/register"
                forgotPasswordLink="/vendor/forgotPassword"
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
          <Route
            path="/vendor/createActivity"
            element={
              <VendorProtectedRoute>
                <CreateActivityPage />
              </VendorProtectedRoute>
            }
          />
          <Route
            path="/vendor/editActivityDraft/:activityId"
            element={
              <VendorProtectedRoute>
                <EditActivityDraftPage />
              </VendorProtectedRoute>
            }
          />
          <Route
            path="/vendor/settings"
            element={
              <VendorProtectedRoute>
                <Navigate to="/vendor/settings/profile" />
              </VendorProtectedRoute>
            }
          />
          <Route
            path="/vendor/settings/profile"
            element={
              <VendorProtectedRoute>
                <AccountDetailsVendor />
              </VendorProtectedRoute>
            }
          />
          <Route
            path="/vendor/settings/picture"
            element={
              <VendorProtectedRoute>
                <ProfilePictureVendor />
              </VendorProtectedRoute>
            }
          />
          <Route
            path="/vendor/settings/password"
            element={
              <VendorProtectedRoute>
                <PasswordChangeVendor />
              </VendorProtectedRoute>
            }
          />
          <Route
            path="/vendor/verifyEmail/:token"
            element={
              <VendorProtectedRoute>
                <VerifyEmailVendor />
              </VendorProtectedRoute>
            }
          />
          <Route
            path="/vendor/verifyEmail"
            element={
              <VendorProtectedRoute>
                <VerifyEmailVendor />
              </VendorProtectedRoute>
            }
          />
          <Route
            path="/vendor/settings/termsAndConditons"
            element={
              <VendorProtectedRoute>
                <PrivacyVendor />
              </VendorProtectedRoute>
            }
          />
          <Route
            exact
            path="/vendor/forgotPassword"
            element={<VendorForgotPassword />}
          />
          <Route
            exact
            path="/vendor/resetPassword"
            element={<VendorResetPassword />}
          />
          <Route
            exact
            path="/vendor/blockout"
            element={
              <VendorProtectedRoute>
                <BlockoutDashboard />
              </VendorProtectedRoute>
            }
          />
          <Route
            exact
            path="/vendor/activity/:activityId/blockout"
            element={
              <VendorProtectedRoute>
                <BlockoutSingleActivity />
              </VendorProtectedRoute>
            }
          />
          <Route
            exact
            path="/vendor/blockout/create/mass"
            element={
              <VendorProtectedRoute>
                <BlockoutMultipleActivities />
              </VendorProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
