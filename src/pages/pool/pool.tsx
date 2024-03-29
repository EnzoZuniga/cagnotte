import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import "./pool.css";

import IActivity from "../../interface/activity";
import IPool from "../../interface/pool";
import Row from "../../components/Row/row";
import IDonation from "../../interface/donation";
import axios from "axios";
import IUser from "../../interface/user";
import PoolPDF from "./poolPDF";

const Pool = ({poolId, setClose, activity, user}: {poolId?: number, setClose?: any, activity?: IActivity, user?: IUser}) => {

  const [donations, setDonations] = useState<IDonation[]>();
  const [pool, setPool] = useState<IPool>();
  const [sortedDonations, setSortedDonations] = useState<IDonation[]>();
  const [total, setTotal] = useState<number>(0);
  const [modalParticipation, setModalParticipation] = useState<boolean>();
  const [available, setAvailable] = useState<boolean>(false);
  const [modalRepartition, setModalRepartition] = useState<boolean>(false);

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

  const downloadPDF = () => {
    setAvailable(true)
    const timerPDF = setTimeout(() => {
      const input: HTMLElement = document.getElementById('divToPrint')!;
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          pdf.addImage(imgData, 'JPEG', 0, 0, 0, 0);
          // pdf.output('dataurlnewwindow');
          pdf.save(`${activity?.attributes.name}-${pool?.attributes.name}.pdf`);
        })
      ;
      setAvailable(false);
    }, 1500);
    return () => clearTimeout(timerPDF);
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
        <div onClick={() => downloadPDF()}>
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
      <div onClick={() => setModalRepartition(true)} className="wrapper-repartition">
        <Button name="répartition"/>
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
        available ?
        (
          <div id="divToPrint" className="pdf">
            <PoolPDF pool={pool} sortedDonations={sortedDonations} activity={activity} user={user} />
          </div>
        ): null
      }
      {
        modalParticipation ?(
          <div className='createModal'>
            <ModalParticipation setModalParticipation={setModalParticipation} user={user} pool={pool} activity={activity} />
          </div>
        ): null
      }
      {
        modalRepartition ?(
          <div className="createModal">
            <ModalRepartition donations={ sortedDonations } pool={ pool } setModalRepartition={setModalRepartition} user={user} />
          </div>
        ): null
      }
    </div>
  )
}

const ModalParticipation = ({setModalParticipation, user, pool, activity}: {setModalParticipation: any, user?: IUser, pool?: IPool, activity?: IActivity}) => {

  const [participation, setParticipation] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>();

  //Participation à un pot
  const participationPost = () => {
    //Le montant de la participation doit être différent de 0
    if(participation !== (0)){
      //POST sur l'entité "donation" en BDD pour créer une occurence
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
      //PUT sur l'entité "pools/id" pour modifier une occurrence de cagnotte afin d'augmenter le valeur "totalDonation"
      axios.put(`http://localhost:1337/api/pools/${pool?.id}`, {
        data: {
          totalDonation: pool?.attributes.totalDonation !== (0 || undefined) ? pool.attributes.totalDonation + participation : participation,
        },
        headers:{
          'Content-Type': 'application/json'
        }
      });
      //POST sur l'entité "notification" pour créer une notification pour l'administrateur de l'activité
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
      //Après 1 seconde et demi, l'utilisateur est redirigé vers l'acceuil
      const timer = setTimeout(() => {
        window.location.href='/home';
      }, 1500)
      return () => clearTimeout(timer);
    }else{
      //Si le donation = 0 alors une erreur s'affichec
      setShowError(true)
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

const ModalRepartition = ({donations, pool, setModalRepartition, user}:{donations?: IDonation[], pool?: IPool, setModalRepartition?:any, user?:IUser}) => {

  const [reste, setReste] = useState<number>(0);
  const [percentDonations, setPercentDonations] = useState<[]>();
  const [switchDiv, setSwitchDiv] = useState<boolean>();

  //Répartition des ressources
  const doRepartition = () => {
    //Le reste ne doit pas être égale à 0
    if(reste !== 0)
    {
      //Déclare un array vide non typer
      let arrayPer: any = [];
      donations?.map((donation: IDonation) => {
        //fait le pourcentage de chaque donation
        let percent = (donation.attributes.somme * 100)/pool?.attributes.totalDonation!;
        //pousse le poucentage et le prénom de la personne qui à donner dans le tableau déclarer ci-dessus
        arrayPer.push({
          name: donation.attributes.giver_name,
          amount: ((percent/100)*reste).toFixed(2),
        })
      });
      //remplace le tableau déclarer ligne 233 par "arrayPer"
      setPercentDonations(arrayPer);
      //affiche le nouveau tableau dans la modal
      setSwitchDiv(true)
    }
  }

  if(switchDiv){
    return (
      <div className='form_wrapper'>
        <div className="wrapper-title-rep">
          <span className="title-resume">Résumer des répartitions</span>
        </div>
        <div className="repartition-wrapper">
          <div className="table">
            {
              percentDonations?.map((donationPer: any) => {
                return (
                  <div key={donationPer.name} className="rep-row">
                    <div className="rep-user">
                      {donationPer.name}
                    </div>
                    <div className="rep-donation">
                      {donationPer.amount}€
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="field">
          <label>Reste de la cagnotte</label>
          <input onChange={(e) => setReste(Number(e.target.value))} type="number" name="montant" id="montant" />
        </div>
        <div className="form_buttons">
          <div onClick={() => doRepartition()}>
            <Button name='Valider' />
          </div>
          <div onClick={() => setModalRepartition(false)}>
            <Button name='Sortir' />
          </div>
        </div>
      </div>
    )
  }else{
    return(
      <div className='form_wrapper'>
        <div className="wrapper-title-rep">
          <span className="title-resume">Résumer des donnations</span>
        </div>
        <div className="repartition-wrapper">
          <div className="table">
            {
              donations?.map((donation: IDonation) => {
                return (
                  <div key={donation.id} className="rep-row">
                    <div className="rep-user">
                      {user?.attributes.name} {user?.attributes.lastname}
                    </div>
                    <div className="rep-donation">
                      {donation.attributes.somme}€
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="field">
          <label>Reste de la cagnotte</label>
          <input onChange={(e) => setReste(Number(e.target.value))} type="number" name="montant" id="montant" />
        </div>
        <div className="form_buttons">
          <div onClick={() => doRepartition()}>
            <Button name='Valider' />
          </div>
          <div onClick={() => setModalRepartition(false)}>
            <Button name='Annuler' />
          </div>
        </div>
      </div>
    )
  }

}

export default Pool;
