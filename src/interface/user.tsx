import React from "react";
import IDonation from "./donation";
import IPool from "./pool";

interface IUser {
  id: number,
  attributes:{
    name: string,
    lastname: string,
    followed_activity: {
      "codes" : number[],
    },
  }
}

export default IUser;
