import React from "react";

import "./navigation.css"
import avatar from "./../assets/avatar.png"
import cloche from "./../assets/cloche.png"

const Navigation = () => {
  return(
    <div className="navBar">
      <div className="info">
        <div className="avatar">
         <img src={avatar} alt="avatar"/>
        </div>
        <div>
          Name
          <br/>
          LastName
        </div>
        <div className="cloche">
          <a href="/notification">
            <img src={cloche} alt="cloche"/>
          </a>
        </div>
      </div>
      <div className="nav">
        <a href="/" >
          Home
        </a>
      </div>
    </div>
  )
}

export default Navigation;