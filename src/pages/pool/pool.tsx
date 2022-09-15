import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";

import "./pool.css";

import IActivity from "../../interface/activity";
import IPool from "../../interface/pool";
import Row from "../../components/Row/row";
import IDonation from "../../interface/donation";
import axios from "axios";
import IUser from "../../interface/user";

const Pool = ({poolId, setClose, activity, user}: {poolId?: number, setClose: any, activity?: IActivity, user?: IUser}) => {

  const [donations, setDonations] = useState<IDonation[]>();
  const [pool, setPool] = useState<IPool>();
  const [sortedDonations, setSortedDonations] = useState<IDonation[]>();
  const [total, setTotal] = useState<number>(0);
  const [modalParticipation, setModalParticipation] = useState<boolean>();

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

    let sortDonations : IDonation[] = [];

    donations?.map((donation: IDonation) => {
      return donation.attributes.pool_id === poolId ? sortDonations.push(donation) : null;
    })

    return setSortedDonations(sortDonations)
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
        <div>
          <Button name="télécharger"/>
        </div>
        <div onClick={() => setModalParticipation(true)}>
          <Button name="Participer"/>
        </div>
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
            sortedDonations?.map((donation: IDonation) => {
              return (
                <Row key={donation.id} name={donation.attributes.giver_name} lastname={donation.attributes.giver_lastname} donation={donation.attributes.somme} />
              )
            })
          }
        </div>
      </div>
      {
        modalParticipation ?(
          <div className='createModal'>
            <ModalParticipation setModalParticipation={setModalParticipation} user={user} pool={pool} activity={activity} />
          </div>
        ): null
      }
    </div>
  )
}

const ModalParticipation = ({setModalParticipation, user, pool, activity}: {setModalParticipation: any, user?: IUser, pool?: IPool, activity?: IActivity}) => {

  const [participation, setParticipation] = useState<number>();
  const [showError, setShowError] = useState<boolean>();

  const participationPost = () => {
    if(participation !== (0 || undefined)){
      axios.post('http://localhost:1337/api/donations', {
        data: {
          somme: participation,
          giver_name: user?.attributes.name,
          giver_lastname: user?.attributes.lastname,
          pool_id: pool?.id,
        },
        headers:{
          'Content-Type': 'application/json'
        }
      });

      axios.put(`http://localhost:1337/api/pools/${pool?.id}`, {
        data: {
          totalDonation: pool?.attributes.totalDonation ? pool.attributes.totalDonation + participation : 0 + participation,
        },
        headers:{
          'Content-Type': 'application/json'
        }
      });

      axios.post('http://localhost:1337/api/notifications', {
        data: {
          name: user?.attributes.name,
          lastname: user?.attributes.lastname,
          open: false,
          amount: participation,
          activity_name: activity?.attributes.name,
          pool_name: pool?.attributes.name,
          user_id: activity?.attributes.admin,
        },
        headers:{
          'Content-Type': 'application/json'
        }
      });
    }
  }

  return(
    <div className='form_wrapper'>
      <div className="field">
        <label>Montant</label>
        <input onChange={(e) => setParticipation(Number(e.target.value))} type="number" name="montant" id="montant" />
      </div>
      <div className="form_buttons">
        <div onClick={() => participationPost()}>
          <Button name='Valider' />
        </div>
        <div onClick={() => setModalParticipation(false)}>
          <Button name='Annuler' />
        </div>
      </div>
      {
        showError ? (
          <span>
              Autre que 0
          </span>
        ) : null
      }
    </div>
  )
}

export default Pool;
