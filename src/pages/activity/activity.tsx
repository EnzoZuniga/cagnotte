import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";
import Pool from "../pool/pool";

import avatarImg from "./../../assets/avatar.png";

import "./activity.css";

import IActivity from "../../interface/activity";
import IPool from "../../interface/pool";

const fakeData : IActivity[] = [
  {
    activityId : 1,
    activityCode: 7674,
    name: "Vacances scolaire",
    admin: true,
    pools: [
      {
        poolId: 1,
        name: "Iphone",
        totalDonation: 230,
        goal: 280,
        users: [
          {
            id: 1,
            name: "Enzo",
            lastname: "Zuniga",
          }
        ],
      }
    ],
  }
]

const Activity = ({setClose, activityId}:{setClose: any, activityId?: number}) => {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [poolToPass, setPoolToPass] = useState<IPool>();
  const [activity, setActivity] = useState<IActivity>({
    activityId: 0,
    activityCode: 0,
    name: "Bad connection",
    admin: true,
  });

  useEffect(()=> {
    //fetching with activityId
    setActivity(fakeData[0])
  }, [])

  if(openModal){
    return(
      <Pool activity={activity} setClose={setOpenModal} pool={poolToPass}/>
    );
  }else{
    return(
      <div className="App">
        <div className="top-home">
          <div className="activity-top">
            <div onClick={() => setClose(false)}>
              <Button name="<"/>
            </div>
            <div className="title">
              {activity?.name} - #{activity.activityCode}
            </div>
            <div className="avatarActivity">
              {
                activity?.admin ? <img src={avatarImg} alt="avatar"/> : null
              }
            </div>
          </div>
          {
            activity.admin? (
              <Button name="créer"/>
            ) : null
          }
        </div>
        <div className="content">
            {
              activity.pools?.map((pool: IPool) => {
                return (
                  <div onClick={() => setPoolToPass(pool)}>
                    <Card
                      type="pool"
                      name={pool.name}
                      avatar={true}
                      number={pool.totalDonation}
                      objectif={pool.goal}
                      setOpen={setOpenModal}
                    />
                  </div>
                )
              })
            }
          </div>
      </div>
    )
  }

}

export default Activity;
