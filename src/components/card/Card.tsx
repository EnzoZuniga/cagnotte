import React from "react";

import avatarImg from "./../../assets/avatar.png"

import "./Card.css";

const Card = ({setOpen, type, name, avatar, number, objectif}: {setOpen?: any, type: string, name: string, avatar: boolean, number?: number, objectif?: number}) => {

  return(
    <div className="card goodType" onClick={() => setOpen(true)}>
      {
        type === "activity" ? (
          <div className="avatarCard">
            {avatar? <img src={avatarImg} alt="avatar"/> : null}
          </div>
        ) : null
      }
      <div className="titleCard">
        {name}
      </div>
      {
        type === "activity"?null:
        (
          <div className="textCard">
            <span>Total: {number}€</span>
            {
              objectif ? (
                  <span>Objectif: {objectif}€</span>
              ): null
            }
          </div>
        )
      }
    </div>
  )
}

export default Card;
