import React, { useState } from "react";
import "./LoginSignUp.css";
import axios from "axios";
import toast from "react-hot-toast";
import { setAuth } from "../../../Redux/Slices/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { LOGIN_API, SAMPLE_TOKEN, SIGNUP_API } from "../../../Data/helpers";

const LoginSignUp = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [activeTab, setActiveTab] = useState("tabButton1");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
  });
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const handleLoginInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRememberMeChange = () => {
    setLoginData({
      ...loginData,
      rememberMe: !loginData.rememberMe,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTab = (tab) => setActiveTab(tab);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_API, loginData);
      if (response && response?.data) {
        const user = response && response?.data;
        const token = SAMPLE_TOKEN;
        // Set cookie expiration based on 'Remember Me'
        const cookieOptions = loginData.rememberMe
          ? { path: "/", maxAge: 30 * 24 * 60 * 60 } // 30 days expiration
          : { path: "/" }; // Session cookie (expires when the browser is closed)
        cookies.set("token", token, cookieOptions);
        cookies.set("user", user, cookieOptions);
        dispatch(setAuth({ user, isAuthenticated: token?.length > 0 }));
        toast.success("Login successful", {
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
      } else {
        toast.error("Invalid credentials", {
          duration: 2000,
          style: {
            backgroundColor: "#ff0000",
            color: "white",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ff0000",
          },
        });
      }
    } catch (err) {
      toast.error("Login failed. Try again", {
        duration: 2000,
        style: {
          backgroundColor: "#ff0000",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff0000",
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(SIGNUP_API, {
        ...formData,
        status: 1,
      });
      debugger;
      if (typeof response.data === "number") {
        toast.success("Registration successful", {
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
        handleTab("tabButton1");
      } else {
        toast.error("Something went wrong, please try again", {
          duration: 2000,
          style: {
            backgroundColor: "#ff0000",
            color: "white",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ff0000",
          },
        });
      }
    } catch (error) {
      toast.error("Registration failed. Try again", {
        duration: 2000,
        style: {
          backgroundColor: "#ff0000",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff0000",
        },
      });
    }
  };

  return (
    <div>
      <div className="loginSignUpSection">
        <div className="loginSignUpContainer">
          <div className="loginSignUpTabs">
            <p
              onClick={() => handleTab("tabButton1")}
              className={activeTab === "tabButton1" ? "active" : ""}
            >
              Login
            </p>
            <p
              onClick={() => handleTab("tabButton2")}
              className={activeTab === "tabButton2" ? "active" : ""}
            >
              Register
            </p>
          </div>
          <div className="loginSignUpTabsContent">
            {/* Tab1 */}
            {activeTab === "tabButton1" && (
              <div className="loginSignUpTabsContentLogin">
                <form onSubmit={handleLoginSubmit}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password *"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    required
                  />
                  <div className="loginSignUpForgetPass">
                    <label className="radioLabel">
                      <input
                        type="checkbox"
                        className="brandRadio"
                        checked={loginData.rememberMe}
                        onChange={handleRememberMeChange}
                      />
                      <p>Remember me</p>
                    </label>
                  </div>
                  <button type="submit">Log In</button>
                </form>
              </div>
            )}

            {/* Tab2 */}
            {activeTab === "tabButton2" && (
              <div className="loginSignUpTabsContentRegister">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Firstname *"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Lastname *"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="genderSelection">
                    <label className="genderLabel">Gender:</label>
                    <label className="radioLabel">
                      <input
                        className="cursor-pointer"
                        type="radio"
                        name="gender"
                        value="male"
                        onChange={handleInputChange}
                        required
                      />
                      <span>Male</span>
                    </label>
                    <label className="radioLabel">
                      <input
                        className="cursor-pointer"
                        type="radio"
                        name="gender"
                        value="female"
                        onChange={handleInputChange}
                        required
                      />
                      Female
                    </label>
                  </div>

                  <button type="submit">Register</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
