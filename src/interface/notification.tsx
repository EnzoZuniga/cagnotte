import React from "react";

interface INotification {
  id: number,
  createdAt: Date,
  name: string,
  lastname: string,
  amount: number,
  activityName: string,
  poolName: string,
  open: boolean,
};

export default INotification;
