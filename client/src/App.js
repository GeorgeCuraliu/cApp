import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage/homePage';
import AuthentificationPage from './components/authentification/authentifiaction';
import ChatPage from './components/chat-page/chat-page';
import { ContextProvider } from './components/context/context';
import { useState } from 'react';
import React from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import Settings from './components/settings/settings';


function App() {

  const [connected, setConnected] = useState(false);

  useWebSocket('ws://127.0.0.1:3009', {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    onmessage: (data) => {
      console.log(data)
    }
  });

  return (
    
      <ContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/authentication/:type' element={<AuthentificationPage />} />
          <Route path='/chat-page' element={<ChatPage />} />
          <Route path='/settings'  element={<Settings />}/>
        </Routes>
      </ContextProvider>
    
  );
}

export default App;
