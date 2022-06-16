import React, { useEffect, useState } from 'react';
import './App.css';

import Button from '../../components/button/Button';
import Card from '../../components/card/Card';

import Activity from '../activity/activity';
import IActivity from '../../interface/activity';

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
      }
    ],
  }
]

function App() {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activities, setActivities] = useState<IActivity[]>(fakeData);
  const [activityId, setActivityId] = useState<number>();
  
  useEffect(() => {
    //fetch all activities with actual user
    setActivities(fakeData);
  }, [])

  if(openModal){
    return(
      <Activity setClose={setOpenModal} activityId={activityId}/>
    );
  }else {
    return (
      <div className="App">
        <div className="top-home">
          <div className="title">
            Activité(s)
          </div>
          <div className="buttons">
            <Button name="suivre"/>
            <Button name="créer"/>
          </div>
        </div>
        <div className="content">
          {
            activities.map((activity: IActivity) => {
              return (
                <div onClick={() => setActivityId(activity.activityId)}>
                  <Card
                    type="activity"
                    name="Sortie vacances"
                    avatar={true}
                    number={4}
                    setOpen={setOpenModal}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    );
  };  
};

export default App;
