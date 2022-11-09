import { Routes, Route, useLocation } from 'react-router-dom';

import Home from '../pages/Home';
import Manager from '../pages/Manager';
import RegisterModal from '../components/RegisterModal';
import LoginModal from '../components/LoginModal';
import PostMusicModal from '../components/PostMusicModal';
import Musics from '../components/ManagerMusics';

const AppRoutes = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Home />}>
          <Route path="register" element={<RegisterModal />} />
          <Route path="login" element={<LoginModal />} />
          <Route path="newMusic" element={<PostMusicModal />} />
        </Route>
        <Route path="/manager" element={<Manager />}>
          <Route path="account" element={<h1 />} />
          <Route path="musics" element={<Musics />}>
            <Route path="newMusic" element={<PostMusicModal />} />
          </Route>
        </Route>
      </Routes>
      {
        background && (
          <Routes>
            <Route path='register' element={<RegisterModal />} />
            <Route path="login" element={<LoginModal />} />
          </Routes>
        )
      }
    </>
  );
};

export default AppRoutes;