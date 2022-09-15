import React from "react";

interface INotification {
  id: number,
  attributes:{
    createdAt: Date,
    name: string,
    lastname: string,
    open: boolean,
    amount: number,
    activity_name: string,
    pool_name: string,
    user_id: number,
  }
};

export default INotification;
