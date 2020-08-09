import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <NavLink to="/my-posts">Home</NavLink>

      <span>
        <NavLink to="/new-post" exact>
          New Post
        </NavLink>

        <NavLink to="/logout" exact>
          Logout
        </NavLink>
      </span>
    </nav>
  );
};

export default Navbar;
