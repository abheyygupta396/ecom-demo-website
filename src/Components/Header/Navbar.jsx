import React, { useState } from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaCartShopping } from "react-icons/fa6";
import { RiShoppingBagLine } from "react-icons/ri";
import { MdLogout, MdOutlineClose } from "react-icons/md";

import Badge from "@mui/material/Badge";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import { setAuth } from "../../Redux/Slices/authSlice";

const Navbar = () => {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const isLogin = Boolean(user) && Boolean(cookies.get("token"));

  const handleLogout = () => {
    const allCookies = cookies.getAll();
    Object.keys(allCookies).forEach((cookieName) => {
      cookies.remove(cookieName, { path: "/" });
    });
    dispatch(setAuth({ user: null, isAuthenticated: false }));
    toast.success("Logout successful", {
      duration: 2000,
      style: {
        backgroundColor: "#07bc0c",
        color: "white",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#07bc0c",
      },
    });
    navigate("/login");
  };

  return (
    <>
      <nav className="navBar">
        <div className="logoLinkContainer">
          <div className="logoContainer">
            <Link to="/" className="header-logo">
              <FaCartShopping size={23} className="icon" />
              <span className="logo-text">ECOM</span>
            </Link>
          </div>
        </div>
        {isLogin && (
          <div className="iconContainer">
            <Link to="/cart">
              <Badge
                badgeContent={cart.items.length === 0 ? "0" : cart.items.length}
                color="primary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <RiShoppingBagLine size={22} />
              </Badge>
            </Link>
            <MdLogout
              onClick={handleLogout}
              className="cursor-pointer"
              size={22}
            />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
