import { Outlet } from 'react-router-dom';
import Slider from '../components/Slider';
import useApi from '../api/useApi';
import Waves from '../components/Waves';

import 'swiper/css';
import '../sass/home.scss';

const Home = () => {
  const { data:musics, error } = useApi({ url: 'musics', method: 'get' });

  const skeleton = !musics && !error;
  
  return (
    <>
      <Waves />
      <main className="container theme-bg-primary">
        <section className="mt-5">
          <h4 className="theme-text">Mais escutadas</h4>
          <Slider data={musics} skeleton={skeleton} />
        </section>
        <section>
          <h4 className="theme-text">Rap/Trap</h4>
          <Slider data={musics} skeleton={skeleton} />
        </section>
        <footer style={{ height: '500px' }}></footer>
        <Outlet />
      </main>
    </>
  );
};

export default Home;