import { ReactComponent as Wave } from '../svg/wave.svg';
import '../sass/waves.scss';

const Waves = () => {
  return (
    <div 
      className='d-flex justify-content-center align-items-center overflow-hidden text-primary position-relative mt-5' 
      style={{ height: '150px', flexShrink: 0 }}
    >
      <Wave className="wave wave-variation" />
      <Wave className="wave" />
      <h1 className="text-white position-absolute">Logo</h1>
    </div>
  );
};

export default Waves;