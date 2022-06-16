import React from "react";

import IPool from "./pool";

interface IActivity {
  activityId : number,
  activityCode: number,
  name: string,
  admin: boolean,
  userId?: string,
  pools?: IPool[],
};

export default IActivity;