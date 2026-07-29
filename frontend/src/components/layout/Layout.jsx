import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import "./css/Layout.css";

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;