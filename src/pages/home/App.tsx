import { useEffect, useState } from 'react';
import './App.css';

import Button from '../../components/button/Button';
import Card from '../../components/card/Card';

import axios from 'axios';
import IActivity from '../../interface/activity';
import IUser from '../../interface/user';
import Activity from '../activity/activity';


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

  //suivre une activity
  const followCode = () => {
    //si le code entrer n'est pas indéfini 
    if(codeActivite !== (undefined)){
      //Création d'un tableau binaire pour chercher si un des code correspond à codeActivite
      const arrayActivities = activities?.map((activity: IActivity) => {
         return activity.attributes.code === codeActivite ? true : false
      });
      
      //Si il y à un seul "true" dans le tableau
      if(arrayActivities?.includes(true)){ 
        //Si l'utilisateur suit déjà l'activité il retourne à l'acceuil
        if(userCodes?.includes(codeActivite)){
          return window.location.href='/home'
        }else{
          //Sinon il ajoute le code dans le tableau de code de l'objet "participant" (utilisateur)
          //et ensuite l'envoie à la BDD avec une requêtes PUT
          //L'utilisateur est redirigé vers la page d'acceuil
          userCodes?.push(codeActivite);
          axios.put(`http://localhost:1337/api/participants/${userId}`, {
            data:{
              "followed_activity": userCodes
            }
          })
          return window.location.href='/home';
        }
      }else{
        //Si il n'y a pas de "true" dans le tableau alors il n'y a pas de code correspondant
        //Un message d'erreur s'affiche
        setShowError(true);
      }
    }else{
      //Le code entrer est indéfini donc un message d'erreur apparait
      setShowError(true);
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

  const [activityName, setActivityName] = useState<string>("");
  const [cagnotteName, setCagnotteName] = useState<string>("");
  const [objectif, setObjectif] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>();

  const getIntRandom = (max: number) => {
    return Math.floor(Math.random() * max);
  }

  //Création d'un nouveau pot commun
  const postNewActivity = () => {
    //Les champs entrer dans le formulaire ne doivent pas être des chaînes de caractères vides
    if(
      (activityName !== (""))
      && (cagnotteName !== (""))
    ) {
      //Déclaration d'un tableau de nombre
      let activityCodeArray: number[] = [];
      //Déclaration d'un nombre aléatoire jusqu'a 9999
      let randomInt = getIntRandom(9999)
      //Remplissage du tableau de nombre par les codes des pots communs
      activities?.map((activity: IActivity) => {
        activityCodeArray.push(activity.attributes.code)
      })
      //Si le nombre aléatoire correspond déjà à un code dans le tableau de code, alors on ajoute 1
      //jusqu'à ce qu'il soit différent des codes existants
      while(activityCodeArray.includes(randomInt)){
        randomInt++;
      }
      //Création d'un nouveau pot commun avec une requête POST
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
      //Crétation d'une nouvelle cagnotte avec une requête POST
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
      //Pousser le nombre aléatoire dans le tableau des codes de l'utilisateur "userCodes"
      userCodes?.push(randomInt)
      //Pousser le tableau "userCodes" par requête PUT dans l'objet "participant" (utilisateur) en BDD
      axios.put(`http://localhost:1337/api/participants/${userId}`, {
        data:{
          "followed_activity": userCodes
        }
      });
      //Ferme la modal
      setDisplayCreateModal(false)
      //Redirige vers l'acceuil
      window.location.href="/home"
    }else{
      //Un des deux champs de formulaire est vide donc un message d'erreur s'affiche
      setShowError(true);
    }
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
        <div onClick={() => postNewActivity()}>
          <Button name='Valider' />
        </div>
        <div onClick={() => {
            setShowError(false)
            setDisplayCreateModal(false)
            }
          }>
          <Button name='Annuler' />
        </div>
      </div>
      {
        showError?(
          <div>
            <p>Il manque des champs</p>
          </div>
        ): null
      }
    </div>
  )
}

export default App;
