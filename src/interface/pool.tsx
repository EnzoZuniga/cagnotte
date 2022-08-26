import React from "react";
import IDonation from "./donation";
import IUser from "./user";

interface IPool {
  id: number,
  attributes:{
    name: string,
    totalDonation: number,
    goal: number,
    activity_code: number,
  }
}

export default IPool;
