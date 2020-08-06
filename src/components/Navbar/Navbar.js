import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav>
      <NavLink to="/my-posts" exact>
        Home
      </NavLink>

      {isAuthenticated ? (
        <NavLink to="/new-post" exact>
          New Post
        </NavLink>
      ) : null}
      {isAuthenticated ? (
        <NavLink to="/logout" exact>
          Logout
        </NavLink>
      ) : null}
    </nav>
  );
};

export default Navbar;
