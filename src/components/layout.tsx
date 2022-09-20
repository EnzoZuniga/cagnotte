import React from "react";
import { Outlet } from "react-router-dom";
import IUser from "../interface/user";
import Navigation from "./navigation";

const Layout = () => {
  return (
    <>
      <Navigation/>
      <Outlet />
    </>
  )
};

export default Layout;
