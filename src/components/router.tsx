import React, { useState } from "react";
import {
  BrowserRouter, Route, Routes
} from "react-router-dom";

import Layout from "./layout";

import App from "../pages/home/App";
import Notification from "../pages/notifications/notification";
import Login from "./login";

function Router() {

  return (
    <div className="bg-zinc-800 font-serif">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/" element={<Layout />}>
          <Route path="/home" element={<App />} />
          <Route path="notification" element={<Notification />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Router;