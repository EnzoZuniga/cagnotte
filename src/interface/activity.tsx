import React from "react";

import IPool from "./pool";
import IUser from "./user";

interface IActivity {
  id?: number,
  attributes: {
    code: number,
    name: string,
    admin: boolean,
    userId?: string,
    pools?: IPool[],
    participants: IUser[],
  }
  activityId : number,
  activityCode: number,
  name: string,
  admin: boolean,
  userId?: string,
  pools?: IPool[],
};

export default IActivity;