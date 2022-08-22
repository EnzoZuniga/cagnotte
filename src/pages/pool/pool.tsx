import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";

import "./pool.css";

import IActivity from "../../interface/activity";
import IPool from "../../interface/pool";
import Row from "../../components/Row/row";
import IDonation from "../../interface/donation";

const fakeData : IDonation[] = [
  {
    id: 1,
    name: "Enzo",
    lastname: "Zuniga",
    somme: 30,
  },
  {
    id: 2,
    name: "Enzo",
    lastname: "Zuniga",
    somme: 30,
  },
  {
    id: 3,
    name: "Enzo",
    lastname: "Zuniga",
    somme: 30,
  }
]

const Pool = ({poolId, setClose, activity}: {poolId?: number,setClose: any, activity?: IActivity}) => {

  const [donations, setDonations] = useState<IDonation[]>(null || []);
  // const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    //fetch users with poolId
    setDonations(fakeData)
    // let totalSomme = 0;
    // fakeData?.forEach((donation: IDonation) => {
    //   totalSomme = totalSomme + donation.somme;
    // });
    // setTotal(totalSomme);
  }, []);

  return(
    <div className="pool">
      <div className="top-home">
        <div className="activity-top">
          <div onClick={() => setClose(false)}>
            <Button name="<"/>
          </div>
          <div className="title">
            {/* {activity?.name} - {pool?.name} */}
          </div>
        </div>
        <Button name="télécharger"/>
      </div>
      <div className="numbers">
        <div className="padding total">
          {/* {pool?.totalDonation}€ */}
        </div>
        <div className="padding goal">
          {/* Objectif: {pool?.goal}€ */}
        </div>
        <div className="separator"/>
      </div>
      <div className="donations">
        <div className="table">
          {
            donations.map((donation: IDonation) => {
              return (
                <Row name={donation.name} lastname={donation.lastname} donation={donation.somme} />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Pool;
