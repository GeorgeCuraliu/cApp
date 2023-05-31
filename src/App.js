import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import HomePage from './components/homepage/homePage';
import AuthentificationPage from './components/authentification/authentifiaction';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/authentication/:type' element={<AuthentificationPage />} />
    </Routes>
  );
}

export default App;
