import React from "react";
import IDonation from "./donation";
import IPool from "./pool";

interface IUser {
  id: number,
  name: string,
  lastname: string,
  adminActivity?: [],
  donations?: IDonation[],
}

export default IUser;
