import React, { useEffect, useState } from "react";
import INotification from "../../interface/notification";

import "./notification.css";

const fakeData : INotification[] = [
  {
    id: 1,
    createdAt: new Date(),
    name: "Enzo",
    lastname: "Zuniga",
    amount: 30,
    activityName: "Test",
    poolName: "Vacances",
    open: false,
  },
  {
    id: 1,
    createdAt: new Date(),
    name: "Enzo",
    lastname: "Zuniga",
    amount: 30,
    activityName: "Test",
    poolName: "Vacances",
    open: true,
  },
  {
    id: 1,
    createdAt: new Date(),
    name: "Enzo",
    lastname: "Zuniga",
    amount: 30,
    activityName: "Test",
    poolName: "Vacances",
    open: true,
  },
];

const Notification = () => {

  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    //fetch notification with get request
    setNotifications(fakeData);
  }, [])

  return(
    <div className="App">
      <div className="top-home">
        <div className="title">
          Notification
        </div>
      </div>
      <div className="notification-table">
        <table >
          <tr className="header-table">
            <th>Date</th>
            <th className="name-width">Nom - Prénom</th>
            <th> Message</th>
          </tr>
          {
            notifications.map((notification: INotification) => {
              return (
                <tr className={notification.open ? "" : "unopenned"}>
                  <th>{notification.createdAt.toDateString()}</th>
                  <th>{notification.name} {notification.lastname}</th>
                  <th>Participe à hauteur de {notification.amount}€ à l'activité "{notification.activityName}" pour la cagnotte "{notification.poolName}" 🎉</th>
                </tr>
              );
            })
          }
        </table>
      </div>
    </div>
  );
};

export default Notification;
