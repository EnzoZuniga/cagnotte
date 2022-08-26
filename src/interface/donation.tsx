import React from "react";

interface IDonation {
  id: number,
  attributes:{
    somme: number,
    giver_name: string,
    giver_lastname: string,
    pool_id: number,
  }
};

export default IDonation;
