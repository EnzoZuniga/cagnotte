import React from "react";
import {
  BrowserRouter, Route, Routes
} from "react-router-dom";

import Layout from "./layout";

import App from "../pages/home/App";
import Notification from "../pages/notifications/notification";

function Router() {

  return (
    <div className="bg-zinc-800 font-serif">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="notification" element={<Notification />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Router;