import React, { useEffect, useState } from "react";

import "./navigation.css"
import avatar from "./../assets/avatar.png"
import cloche from "./../assets/cloche.png"
import IUser from "../interface/user";
import axios from "axios";

const Navigation = () => {

  const [user, setUser] = useState<IUser>()

  useEffect(() => {
    if (!user){
      axios.get('http://localhost:1337/api/participants/1').then(response => {
        setUser(response.data.data);
      });
    };
  })

  return(
    <div className="navBar">
      <div className="info">
        <div className="avatar">
         <img src={avatar} alt="avatar"/>
        </div>
        <div>
          {user?.attributes?.name}
          <br/>
          {user?.attributes?.lastname}
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