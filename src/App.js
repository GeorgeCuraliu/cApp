import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import HomePage from './components/homepage/homePage';
import AuthentificationPage from './components/authentification/authentifiaction';
import ChatPage from './components/chat-page/chat-page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/authentication/:type' element={<AuthentificationPage />} />
      <Route path='/chat-page' element={<ChatPage />} />
    </Routes>
  );
}

export default App;
