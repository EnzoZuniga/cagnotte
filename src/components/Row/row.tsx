import React from "react";

import "./row.css";

const Row = ({name, lastname, donation}: {name: string, lastname: string, donation: number}) => {
  return(
    <div className="row">
      <div className="user">
        {name} {lastname}
      </div>
      <div className="donation">
        {donation}€
      </div>
    </div>
  )
};

export default Row;
