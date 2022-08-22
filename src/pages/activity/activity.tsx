import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";
import Pool from "../pool/pool";

import avatarImg from "./../../assets/avatar.png";

import "./activity.css";

import IActivity from "../../interface/activity";
import IPool from "../../interface/pool";
import axios from "axios";

const Activity = ({setClose, activityId}:{setClose: any, activityId?: number}) => {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [poolToPass, setPoolToPass] = useState<number>();
  const [sortedPools, setSortedPools] = useState<IPool[]>();
  const [activity, setActivity] = useState<IActivity>();
  const [pools, setPools] = useState<IPool[]>();

  useEffect(()=> {
    //Call api pour l'activité
    if(!activity){
      axios.get(`http://localhost:1337/api/activities/${activityId}`).then(response => {
        setActivity(response.data.data)
      });
    }

    //Call api pour les pools
    if(!pools){
      axios.get('http://localhost:1337/api/pools').then(response => {
        setPools(response.data.data)
      });
    }

    sortPools();
  }, [activityId, activity])

  const sortPools = () => {
    return setSortedPools(pools?.filter((pool : IPool) => pool?.attributes?.activity_code == activity?.attributes.code));
  }

  if(openModal){
    return(
      <Pool activity={activity} setClose={setOpenModal} poolId={poolToPass}/>
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
              {activity?.attributes.name} - #{activity?.attributes.code}
            </div>
            <div className="avatarActivity">
              {
                activity?.attributes.admin ? <img src={avatarImg} alt="avatar"/> : null
              }
            </div>
          </div>
          {
            activity?.attributes.admin? (
              <Button name="créer"/>
            ) : null
          }
        </div>
        <div className="content">
            {
              sortedPools?.map((pool: IPool) => {
                return (
                  <div key={pool.id} onClick={() => setPoolToPass(pool.id)}>
                    <Card
                      type="pool"
                      name={pool?.attributes?.name}
                      avatar={true}
                      number={pool?.attributes?.totalDonation}
                      objectif={pool?.attributes?.goal}
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
