import React, { useEffect, useReducer, useState } from 'react';
import './App.css';

import Button from '../../components/button/Button';
import Card from '../../components/card/Card';

import Activity from '../activity/activity';
import IActivity from '../../interface/activity';
import IUser from '../../interface/user';
import axios from 'axios';

import process from 'process';

function App() {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const [sortedActivities, setSortedActivities] = useState<IActivity[]>();
  const [activities, setActivities] = useState<IActivity[]>();
  const [activityId, setActivityId] = useState<number>();
  const [displayCreateModal, setDisplayCreateModal] = useState<boolean>(false);
  const [displayFollowModal, setDisplayFollowModal] = useState<boolean>(false);
  
  useEffect(() => {

    console.log(localStorage.getItem('userid'))
    //fetch all activities with actual user
    if (!user){
      axios.get(`http://localhost:1337/api/participants/${localStorage.getItem('userid')}`).then(response => {
        setUser(response.data.data);
      });
    };

    console.log(user)

    if(!activities){
      axios.get('http://localhost:1337/api/activities').then(response => {
        setActivities(response.data.data)
      });
    }

    sortActivities()
  }, [user, activities])

  const sortActivities = () => {
    return setSortedActivities(activities?.filter((activity : IActivity) => user?.attributes.followed_activity.includes(activity.attributes.code)));
  }

  if(openModal){
    return(
      <Activity setClose={setOpenModal} activityId={activityId} user={user} />
    );
  }else {
    return (
      <div className="App">
        <div className="top-home">
          <div className="title">
            Pots Communs
          </div>
          <div className="buttons">
            <div onClick={() => setDisplayFollowModal(true)}>
              <Button name="suivre"/>
            </div>
            <div onClick={() => setDisplayCreateModal(true)}>
              <Button name="créer"/>
            </div>
          </div>
        </div>
        <div className="content">
          {
            sortedActivities?.map((activity: IActivity) => {
              return (
                <div className='activity' key={activity.id} onClick={() => setActivityId(activity.id)}>
                  <Card
                    type="activity"
                    name={activity.attributes?.name || ""}
                    avatar={user?.id === activity.attributes.admin ? true : false}
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
            <CreatModal activities={activities} setDisplayCreateModal={setDisplayCreateModal} userId={user?.id} userCodes={user?.attributes.followed_activity} setActivities={setActivities}/>
          </div>
          ) : null
        }
        {
          displayFollowModal === true ?(
            <div className='createModal'>
              <FollowModal setDisplayFollowModal={setDisplayFollowModal} userCodes={user?.attributes.followed_activity} activities={activities} userId={user?.id} />
            </div>
          ): null
        }
      </div>
    );
  };  
};

const FollowModal = ({setDisplayFollowModal, userCodes, userId, activities}: {setDisplayFollowModal: any, userCodes?: number[], userId?: number, activities?: IActivity[]}) => {

  const [codeActivite, setCodeActivite] = useState<number>();
  const [showError, setShowError] = useState<boolean>();

  const followCode = () => {
    if(codeActivite !== (0 || undefined)){
      const arrayActivities = activities?.map((activity: IActivity) => {
         return activity.attributes.code === codeActivite ? true : false
      });
      
      if(arrayActivities?.includes(true)){ 
        if(userCodes?.includes(codeActivite)){
          return window.location.href='/home'
        }else{
          userCodes?.push(codeActivite);
          axios.put(`http://localhost:1337/api/participants/${userId}`, {
            data:{
              "followed_activity": userCodes
            }
          })
          return window.location.href='/home';
        }
      }else{
        setShowError(true);
      }
    }
  }

  return(
    <div className='form_wrapper'>
      <div className="field">
        <label>Code Activité</label>
        <input onChange={(e) => setCodeActivite(Number(e.target.value))} type="number" name="code" id="code" />
      </div>
      <div className="form_buttons">
        <div onClick={() => followCode()}>
          <Button name='Valider' />
        </div>
        <div onClick={() => setDisplayFollowModal(false)}>
          <Button name='Annuler' />
        </div>
      </div>
      {
        showError ? (
          <span>
              Mauvais code
          </span>
        ) : null
      }
    </div>
  )
}

const CreatModal = ({setDisplayCreateModal, activities, userId, userCodes, setActivities} : {setDisplayCreateModal: any, activities?: IActivity[], userId?: number, userCodes?: number[], setActivities: any}) => {

  const [activityName, setActivityName] = useState<string>();
  const [cagnotteName, setCagnotteName] = useState<string>();
  const [objectif, setObjectif] = useState<number>();

  const getIntRandom = (max: number) => {
    return Math.floor(Math.random() * max);
  }

  const postNewActivity = () => {
    if(
      (activityName !== (null || ""))
      && (cagnotteName !== (null || ""))
      && (objectif !== (null || 0))
    ) {
      
      let activityCodeArray: number[] = [];
      let randomInt = getIntRandom(9999)
      activities?.map((activity: IActivity) => {
        activityCodeArray.push(activity.attributes.code)
      })
      
      while(activityCodeArray.includes(randomInt)){
        randomInt++;
      }
      
      axios.post('http://localhost:1337/api/activities', {
        data:{
          code: randomInt,
          name: activityName,
          admin: userId,
        },
        headers:{
          'Content-Type': 'application/json'
        }
      });

      axios.post('http://localhost:1337/api/pools', {
        data: {
          name: cagnotteName,
          totalDonation: 0,
          goal: objectif,
          activity_code: randomInt,
        },
        headers:{
          'Content-Type': 'application/json'
        }
    });

      userCodes?.push(randomInt)

      axios.put(`http://localhost:1337/api/participants/${userId}`, {
        data:{
          "followed_activity": userCodes
        }
      })
    }

    setDisplayCreateModal(false)
  };

  return(
    <div className="form_wrapper">
      <div className="field">
        <label>Nom de l'activié</label>
        <input onChange={(e) => setActivityName(e.target.value)} type="text" name="activity_name" id="activity_name" maxLength={15} required />
      </div>
      <div className="field">
        <label>Nom de la cagnotte</label>
        <input onChange={(e) => setCagnotteName(e.target.value)} type="text" name="cagnotte_name" id="cagnotte_name" maxLength={15} required />
      </div>
      <div className="field">
        <label>Objectif de la cagnotte</label>
        <input onChange={(e) => setObjectif(Number(e.target.value))} type="number" name="objectif" id="objectif" />
      </div>
      <div className="form_buttons">
        <a href='/home' onClick={() => postNewActivity()}>
          <Button name='Valider' />
        </a>
        <div onClick={() => setDisplayCreateModal(false)}>
          <Button name='Annuler' />
        </div>
      </div>
    </div>
  )
}

export default App;
