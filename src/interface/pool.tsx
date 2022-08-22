import React from "react";
import IDonation from "./donation";
import IUser from "./user";

interface IPool {
  poolId: number,
  attributes:{
    name: string,
    totalDonation: number,
    goal: number,
    activity_code: number,
  }
  id?: number,
  name: string,
  totalDonation: number,
  goal: number,
  donations?: IDonation[],
  users?: IUser[],
}

export default IPool;
