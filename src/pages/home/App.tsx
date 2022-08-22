import React, { useEffect, useState } from 'react';
import './App.css';

import Button from '../../components/button/Button';
import Card from '../../components/card/Card';

import Activity from '../activity/activity';
import IActivity from '../../interface/activity';
import IUser from '../../interface/user';
import axios from 'axios';

function App() {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const [sortedActivities, setSortedActivities] = useState<IActivity[]>();
  const [activities, setActivities] = useState<IActivity[]>();
  const [activityId, setActivityId] = useState<number>();
  
  useEffect(() => {
    //fetch all activities with actual user
    if (!user){
      axios.get('http://localhost:1337/api/participants/1').then(response => {
        setUser(response.data.data);
      });
    };

    if(!activities){
      axios.get('http://localhost:1337/api/activities').then(response => {
        setActivities(response.data.data)
      });
    }

    sortActivities()
  }, [user, activities])

  const sortActivities = () => {
    return setSortedActivities(activities?.filter((activity : IActivity) => user?.attributes.followed_activity.codes.includes(activity.attributes.code)));
  }

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
            sortedActivities?.map((activity: IActivity) => {
              return (
                <div className='activity' key={activity.id} onClick={() => setActivityId(activity.id)}>
                  <Card
                    type="activity"
                    name={activity.attributes?.name || ""}
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
