import { BrowserRouter as Router } from 'react-router-dom';
import { MusicPlayerContext } from './context/MusicPlayerContext';
import { PopupContext } from './context/PopupContext';
import { UserContext } from './context/UserContext';
import { useEffect, useState } from 'react';

import api from './api/api';
import Routes from './routes/Routes';

import Header from './components/Header';
import Home from './pages/Home';
import Player from './components/Player';
import Popups from './components/Popups';

import './sass/vars.scss';
import './sass/style.scss';
import './sass/skeleton.scss';

function App() {
  const [user, setUser] = useState(null);
  const [musicPlayerStatus, setMusicPlayerStatus] = useState({ music: null, currentAudio: null, active: null });
  const [popups, setPopups] = useState([]);

  const dispatchPopup = (popup = { title: null, content: null }) => {
    let id = null;
    if (popups.length === 0) {
      id = 0;
    } else {
      id = popups[popups.length - 1].id + 1
    }

    const newPopup = { 
      id,
      ...popup
    }

    setPopups([ ...popups, newPopup ]);
  };
  
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <Header /> 
      </UserContext.Provider>
      
      <PopupContext.Provider value={{ popups, setPopups, dispatchPopup }}>
        <Popups />
      </PopupContext.Provider>
      
      {
        musicPlayerStatus.active && <Player status={musicPlayerStatus} set={setMusicPlayerStatus} />
      }
      
      <PopupContext.Provider value={{ popups, setPopups, dispatchPopup }}>
        <UserContext.Provider value={{ user, setUser }}>
          <MusicPlayerContext.Provider value={{ status: musicPlayerStatus, setStatus: setMusicPlayerStatus }}>
            <Routes />
          </MusicPlayerContext.Provider>
        </UserContext.Provider>
      </PopupContext.Provider>
      
    </Router>
  );
}

export default App;
