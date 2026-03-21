import React from "react";
import logo from "../assets/logo.png";
const NavBar = () => {
  return (
    <>
      <nav>
        <div className="left">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="btns">
            <button>Login </button>
            <button>Register</button>
          </div>
        </div>

        <div className="center">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="#">All Products</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
          </ul>
        </div>
        <div className="right">

        </div>
      </nav>
    </>
  );
};

export default NavBar;
