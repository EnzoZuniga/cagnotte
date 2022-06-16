import React from "react";

import "./Button.css";

const Button = ({name}: {name: string}) => {
  return(
    <button className="button">
      {name}
    </button>
  )
}

export default Button;