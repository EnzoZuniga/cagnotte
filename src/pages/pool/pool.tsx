import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";

import "./pool.css";

import IActivity from "../../interface/activity";
import IPool from "../../interface/pool";
import Row from "../../components/Row/row";
import IDonation from "../../interface/donation";
import axios from "axios";

const Pool = ({poolId, setClose, activity}: {poolId?: number, setClose: any, activity?: IActivity}) => {

  const [donations, setDonations] = useState<IDonation[]>();
  const [pool, setPool] = useState<IPool>();
  const [sortedDonations, setSortedDonations] = useState<IDonation[]>();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    //Call pool with ID
    if(!pool){
      axios.get(`http://localhost:1337/api/pools/${poolId}`).then(response => {
        setPool(response.data.data)
      });
    }

    //Call donations
    if(!donations){
      axios.get('http://localhost:1337/api/donations').then(response => {
        setDonations(response.data.data)
      });
    }

    sortDonations();

    //initial total
    let totalSomme = 0;
    sortedDonations?.forEach((donation: IDonation) => {
      totalSomme = totalSomme + donation.attributes.somme;
    });
    setTotal(totalSomme);
  }, [donations, pool, poolId, total]);

  //sort all donations by pool id
  const sortDonations = () => {
    return setSortedDonations(donations?.filter((donations : IDonation) => pool?.id === donations.attributes.pool_id));
  }

  return(
    <div className="pool">
      <div className="top-home">
        <div className="activity-top">
          <div onClick={() => setClose(false)}>
            <Button name="<"/>
          </div>
          <div className="title">
            {activity?.attributes.name} - {pool?.attributes.name}
          </div>
        </div>
        <Button name="télécharger"/>
      </div>
      <div className="numbers">
        <div className="padding total">
          {pool?.attributes.totalDonation}€
        </div>
        <div className="padding goal">
          Objectif: {pool?.attributes.goal}€
        </div>
        <div className="separator"/>
      </div>
      <div className="donations">
        <div className="table">
          {
            donations?.map((donation: IDonation) => {
              return (
                <Row name={donation.attributes.giver_name} lastname={donation.attributes.giver_lastname} donation={donation.attributes.somme} />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Pool;
