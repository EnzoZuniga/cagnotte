import axios from "axios";
import React, { useEffect, useState } from "react";
import INotification from "../../interface/notification";
import IUser from "../../interface/user";

import "./notification.css";

const Notification = () => {

  const [notifications, setNotifications] = useState<INotification[]>();
  const [user, setUser] = useState<IUser>();
  const [sortedNotifications, setSortedNotifications] = useState<INotification[]>();

  useEffect(() => {
    if (!user){
      axios.get('http://localhost:1337/api/participants/1').then(response => {
        setUser(response.data.data);
      });
    };

    //Call to get notifications
    if(!notifications){
      axios.get('http://localhost:1337/api/notifications').then(response => {
        setNotifications(response.data.data)
      });
    }

    sortNotifications();
  }, [notifications, user])

  const sortNotifications = () => {
    return setSortedNotifications(notifications?.filter((notification : INotification) => notification?.attributes?.user_id === user?.id));
  }

  const setOpenNotification = (notification: INotification) => {
    console.log("passe3")
    let notificationToPut = {
      data:{
        attributes: {
          open: true,
          name: notification.attributes.name,
          lastname: notification.attributes.lastname,
          amount: notification.attributes.amount,
          activity_name: notification.attributes.activity_name,
          pool_name: notification.attributes.pool_name,
          user_id: notification.attributes.user_id
        }
      }
    };
    console.log(notificationToPut)
    // axios.put(`http://localhost:1337/api/notifications/${notification.id}`, notificationToPut);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        openNotification();
        console.log("passe")
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const openNotification = () => {
    console.log("passe2")
    sortedNotifications?.map((notification : INotification) => {
      return setOpenNotification(notification)
    })
  }

  return(
    <div className="App">
      <div className="top-home">
        <div className="title">
          Notifications
        </div>
      </div>
      <div className="notification-table">
        <table >
          <tbody>
            <tr className="header-table">
              <th>Date</th>
              <th className="name-width">Nom - Prénom</th>
              <th> Message</th>
            </tr>
            {
              sortedNotifications?.map((notification: INotification) => {
                return (
                  <tr key={notification.id} className={notification.attributes.open ? "" : "unopenned"}>
                    <th>{new Date(notification.attributes.createdAt.toString()).toLocaleString("fr")}</th>
                    <th>{notification.attributes.name} {notification.attributes.lastname}</th>
                    <th>Participe à hauteur de {notification.attributes.amount}€ à l'activité "{notification.attributes.activity_name}" pour la cagnotte "{notification.attributes.pool_name}" 🎉</th>
                  </tr>
                );
              }).reverse()
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notification;
