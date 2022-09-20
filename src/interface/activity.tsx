import React from "react";

import IPool from "./pool";
import IUser from "./user";

interface IActivity {
  id: number,
  attributes: {
    code: number,
    name: string,
    admin: number,
  }
};

export default IActivity;