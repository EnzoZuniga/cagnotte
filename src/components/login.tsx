import axios from 'axios';
import React, { useEffect, useState } from 'react';
import IUser from '../interface/user';
import "./login.css";

const Login = () => {

  const [openLogIn, setOpenLogIn] = useState<boolean>(false);
  const [openSignIn, setOpenSignIn] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword]= useState<string>();
  const [showLogInError, setShowLogInError] = useState<boolean>(false);
  const [showSignInError, setShowSignInError] = useState<boolean>(false);
  const [showValideMessage, setShowValidMessage] = useState<boolean>(false);

  useEffect(() => {
    axios.get('http://localhost:1337/api/participants').then((response) => {
      setUsers(response.data.data)
    })
  },[])

  const logIn = () => {
    if(
      email !== ('' || undefined)
      && password !== ('' || undefined)
    ){
      users.map((user: IUser) => {
        if(
          user.attributes.mail === email
          && user.attributes.password === password
        ){
          localStorage.setItem('userid',user.id.toString())
          return window.location.href='/home'
        } else {
          return setShowLogInError(true)
        }
      })
    }else{
      setShowLogInError(true)
    }
  }

  const signIn = () => {
    if(
      email !== ('' || undefined)
      && password !== ('' || undefined)
      && firstName !== ('' || undefined)
      && lastName !== ('' || undefined)
    ){
      axios.post('http://localhost:1337/api/participants', {
        data:{
          name: firstName,
          lastname: lastName,
          mail: email,
          password: password,
          followed_activity: [],
        },
        headers:{
          'Content-Type': 'application/json'
        }
      });
      setShowValidMessage(true);
      setOpenSignIn(false);
      setShowLogInError(false);
    }else{
      setShowSignInError(true)
    }
  }

  return(
    <div className="login-wrapper">
      <div className='wrapper-forms'>
        {
          showValideMessage ? (
            <div className='valide-message'>
              Inscription OK ! Connectez-vous !
            </div>
          ): null
        }
        <div className='log-in'>
          <div onClick={() => {
            setOpenLogIn(!openLogIn)
            setOpenSignIn(false)
            setShowSignInError(false)
            }}
            className='titleForm'>
            <h1 className='h1-login'>Connexion</h1>
          </div>
          {
            openLogIn?(
              <div className='form'>
                <label className='label-login'>
                  <p>E-Mail</p>
                  <input className='input-login' onChange={(e) => setEmail(e.target.value)} type="text" />
                </label>
                <label className='label-login'>
                  <p>Mot de passe</p>
                  <input className='input-login' onChange={(e) => setPassword(e.target.value)} type="password" />
                </label>
                <div className='submit'>
                  <button className='button-login' onClick={() => logIn()}>Submit</button>
                </div>
                {
                  !showLogInError
                  ? null
                  : (
                    <div className='error'>
                      Le mail ou le mot de passe sont incorrect
                    </div>
                  )
                }
              </div>
            ): null
          }
        </div>
        <div className='separator'/>
        <div className='sign-in'>
          <div onClick={() => {
            setOpenSignIn(!openSignIn)
            setOpenLogIn(false)
            setShowLogInError(false)
            }}
            className='titleForm'>
            <h1 className='h1-login'>Inscription</h1>
          </div>
          {
            openSignIn?(
              <div className='form'>
                <label className='label-login'>
                  <p>Nom</p>
                  <input className='input-login' onChange={(e) => setFirstName(e.target.value)} type="text" />
                </label>
                <label className='label-login'>
                  <p>Prénom</p>
                  <input className='input-login' onChange={(e) => setLastName(e.target.value)} type="text" />
                </label>
                <label className='label-login'>
                  <p>E-Mail</p>
                  <input className='input-login' onChange={(e) => setEmail(e.target.value)} type="email" />
                </label>
                <label className='label-login'>
                  <p>Mot de Passe</p>
                  <input className='input-login' onChange={(e) => setPassword(e.target.value)} type="password" />
                </label>
                <div className='submit'>
                  <button className='button-login' onClick={() => signIn()}>Submit</button>
                </div>
                {
                  !showSignInError
                  ? null
                  : (
                    <div className='error'>
                      Il y a une erreur quelque part
                    </div>
                  )
                }
              </div>
            ): null
          }
        </div>
      </div>
    </div>
  )
}

export default Login;
