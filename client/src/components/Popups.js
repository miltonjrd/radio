import { ReactComponent as DeleteIcon } from '../svg/icon-delete.svg';
import { useEffect, useContext, useRef, useState } from 'react';
import { PopupContext } from '../context/PopupContext';
import styled from 'styled-components';
import '../sass/popup.scss';

const PopupsContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: .75rem;
  width: 400px;
  z-index: 1066;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
`;

const PopupCard = styled.article`
  background: #fff;
  width: 100%;
  min-height: 100px;
  padding: .5rem;
  border: 1px solid var(--bs-primary);
  border-left-width: .25rem;
  border-radius: .5rem;
  box-shadow: 0 .25rem .5rem rgb(0, 0, 0, .2);
`;

const Popup = ({ title, content, remove }) => {
  const [timeoutId, setTimeoutId] = useState(null);
  const ref = useRef();

  const startHideCountdown = () => {
    console.log('a')
    const timeout = setTimeout(() => {
      ref.current.classList.add('popup-fade');
      setTimeout(() => {
        remove();
      }, 1000);
    }, 5000);
    setTimeoutId(timeout);
  };

  const handleMouseOver = () => {
    
    if (timeoutId) {
      console.log(timeoutId)
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const handleMouseLeave = () => {
    startHideCountdown();
  };

  useEffect(() => {
    startHideCountdown();
    
    return () => {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, []);

  return (
    <PopupCard ref={ref} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <div className="d-flex justify-content-between">
        <h5>{title}</h5>
        <button className="btn text-reset" onClick={() => remove()}>
          <DeleteIcon />
        </button>
      </div>
      <p className="ms-2">{content}</p>
    </PopupCard>
    
  );
};

const Popups = () => {
  const { popups, setPopups } = useContext(PopupContext);

  return (
    <PopupsContainer>
      {
        popups?.map((popup, i) => (
          <Popup 
            key={popup?.id}
            remove={() => {
              let newPopups = popups.filter((p) => p.id !== popup.id);
              setPopups(newPopups);
            }}
            {...popup}
          />
        ))
      }
    </PopupsContainer>
  );
};

export default Popups;