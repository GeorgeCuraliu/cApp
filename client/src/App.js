import './App.css';
import { Route, Routes, useNavigate  } from 'react-router-dom';
import HomePage from './components/homepage/homePage';
import AuthentificationPage from './components/authentification/authentifiaction';
import ChatPage from './components/chat-page/chat-page';
import React, { useEffect, useContext } from 'react';
import Settings from './components/settings/settings';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Context } from './components/context/context';
import websocket from './components/modules/websocket';

function App() {

  const [cookies, setCookie] = useCookies(["user"]);
  const navigate = useNavigate();
  let {setName, setCode} = useContext(Context);

  useEffect(() => {//in case the app finds a cookie with log in data, it will try to verify the data and send the user to /chat-page url
    
    if(cookies.user){
      console.log(cookies.user);
      const credentials = cookies.user.split(" ");

      axios.post("http://localhost:3009/logIn", {userName: credentials[0], password: credentials[1]})
        .then(response => {
          if(response.status === 200){
            setName(credentials[0]);
            setCode(response.data.code);
            websocket.send(JSON.stringify({type:"auth", data: {username: credentials[0], usercode: response.data.code}}));
            navigate('/chat-page');
          }
        }).catch(err => {
          console.log("cookie data is not valid");
        })

    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/authentication/:type' element={<AuthentificationPage />} />
      <Route path='/chat-page' element={<ChatPage />} />
      <Route path='/settings'  element={<Settings />}/>
    </Routes>
  );
}

export default App;
