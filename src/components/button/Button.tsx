import React from "react";

import "./Button.css";

const Button = ({name, func, bool}: {name: string, func?: any, bool?: boolean}) => {
  return(
    <button className="button" onClick={() => func ? func(bool) : null}>
      {name}
    </button>
  )
}

export default Button;