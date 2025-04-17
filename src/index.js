import React from "react"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./assets/plugins/nucleo/css/nucleo.css";
import "./assets/css/CongratulationPopup.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/dashboard-react.scss";
import "./views/app.css";
import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth.js";
import { Provider, useSelector } from 'react-redux';
import { store, persister } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Confirmpassword from "../src/views/pages/auth/confirmpassword";
import OTPVerification from "views/pages/auth/otp-verification";
import { createGenerateClassName, StylesProvider } from '@material-ui/core/styles';
import { ErrorProvider } from './views/pages/component/ErrorContext'; 

const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
  disableGlobal: true
});
const RootApp = () => {
  const account = useSelector((state) => state.account);

  const isAuthenticated = () => {
    return account.isLoggedIn;
  };

  return (
    
    <GoogleOAuthProvider clientId="678138449376-njuhfuaoh2rff0g9djjlgu754p8fqn03.apps.googleusercontent.com">
    
      <PersistGate loading={null} persistor={persister}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/route/resetPassword"
              element={
                <Confirmpassword/>
              }
            />
             <Route
              path="/route/otp-verification"
              element={
                <OTPVerification/>
              }
            />
            <Route
              path="/auth/*"
              element={
                isAuthenticated() ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <AuthLayout />
                )
              }
            />
            <Route
              path="/admin/*"
              element={
                isAuthenticated() ? (
                  <AdminLayout />
                ) : (
                  // Redirect to the login page if not authenticated
                  <Navigate to="/auth/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </GoogleOAuthProvider>
  );
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
  <StylesProvider generateClassName={ generateClassName }>
  <Provider store={store}>
  <ErrorProvider> 
    <RootApp />
    </ErrorProvider>
  </Provider>
  </StylesProvider>
  </StrictMode>
);