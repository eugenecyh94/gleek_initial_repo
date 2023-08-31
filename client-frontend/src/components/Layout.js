import React from "react";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div style={{ paddingTop: "64px" }}>
        {/* Content will be rendered here */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
