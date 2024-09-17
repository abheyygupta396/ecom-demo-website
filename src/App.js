import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../src/Pages/Home";
import Header from "../src/Components/Header/Navbar";
import Footer from "../src/Components/Footer/Footer";
import "./App.css";
import ScrollToTop from "./Components/ScrollButton/ScrollToTop";
import Authentication from "./Pages/Authentication";
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { setAuth } from "./Redux/Slices/authSlice";

const App = () => {
  const cookies = new Cookies();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Boolean(cookies.get("user"))) {
      const user = cookies.get("user");
      const token = cookies.get("token");
      dispatch(setAuth({ user, isAuthenticated: token?.length > 0 }));
    }
  }, []);

  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(user) && Boolean(cookies.get("token"));

  return (
    <div>
      <ScrollToTop />
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Routes for authenticated users */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              {/* Routes for unauthenticated users */}
              <Route path="/" element={<Authentication />} />
              <Route path="/loginSignUp" element={<Authentication />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
};

export default App;
