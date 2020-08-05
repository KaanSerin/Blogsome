import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <NavLink to="/" exact>
        Home
      </NavLink>

      <NavLink to="/new-post" exact>
        New Post
      </NavLink>
    </nav>
  );
};

export default Navbar;
