import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";
import Pool from "../pool/pool";

import avatarImg from "./../../assets/avatar.png";

import "./activity.css";

import IActivity from "../../interface/activity";
import IPool from "../../interface/pool";
import axios from "axios";
import IUser from "../../interface/user";

const Activity = ({setClose, activityId, user}:{setClose: any, activityId?: number, user?: IUser}) => {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [poolToPass, setPoolToPass] = useState<number>();
  const [sortedPools, setSortedPools] = useState<IPool[]>();
  const [activity, setActivity] = useState<IActivity>();
  const [pools, setPools] = useState<IPool[]>();
  const [displayCreateModal, setDisplayCreateModal] = useState<boolean>(false);

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
      <Pool activity={activity} setClose={setOpenModal} poolId={poolToPass} user={user}/>
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
              <div onClick={() => setDisplayCreateModal(true)}>
                <Button name="créer"/>
              </div>
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
        {
          displayCreateModal === true ?(
          <div className='createModal'>
            <CreatModal setDisplayCreateModal={setDisplayCreateModal} activity={activity}/>
          </div>
          ) : null
        }
      </div>
    )
  }
}

const CreatModal = ({setDisplayCreateModal, activity} : {setDisplayCreateModal: any, activity?: IActivity}) => {

  const [cagnotteName, setCagnotteName] = useState<string>();
  const [objectif, setObjectif] = useState<number>();

  const postNewActivity = () => {
    if(
      (cagnotteName !== (null || ""))
      && (objectif !== (null || 0))
    ) {
      axios.post('http://localhost:1337/api/pools', {
        data: {
          name: cagnotteName,
          totalDonation: 0,
          goal: objectif,
          activity_code: activity?.attributes.code,
        },
        headers:{
          'Content-Type': 'application/json'
        }
      });
    }

    setDisplayCreateModal(false)
  };

  return(
    <div className="form_wrapper">
      <div className="field">
        <label>Nom de la cagnotte</label>
        <input onChange={(e) => setCagnotteName(e.target.value)} type="text" name="cagnotte_name" id="cagnotte_name" maxLength={15} required />
      </div>
      <div className="field">
        <label>Objectif de la cagnotte</label>
        <input onChange={(e) => setObjectif(Number(e.target.value))} type="number" name="objectif" id="objectif" />
      </div>
      <div className="form_buttons">
        <a href="/" onClick={() => postNewActivity()}>
          <Button name='Valider' />
        </a>
        <div onClick={() => setDisplayCreateModal(false)}>
          <Button name='Annuler' />
        </div>
      </div>
    </div>
  )
}

export default Activity;
