import { useState, useContext, forwardRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import styled from "styled-components";

const Aside = styled.aside`
  position: relative;
  background: #fbfbfb;
  width: 250px;
  z-index: 200;

  @media (max-width: 480px) {
    position: fixed;
    left: 100%;
    transition: transform ease-in-out .2s;

    &.active {
      transform: translateX(-100%);
    }
  }
`;

const Avatar = styled.div`
  background: gray;
  height: 150px;
  width: 150px;
  border-radius: 55rem;
  margin: 0 auto;
  margin-top: 1rem;
`;
 
const Navitem = styled(Link)`
  display: flex;
  align-items: center;
  color: #000;
  height: 50px;
  width: 100%;
  padding: 0 2rem;
  text-decoration: none;
  border-left: .25rem solid transparent;

  &:hover {
    background: #efefef;
    color: #000;
  }

  &.active {
    background: #efefef;
    border-left-color: var(--bs-primary);
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const CircleButton = styled.button`
  background: transparent;
  color: #aaa;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  transition: background .1s ease-in;
  
  &:hover {
    background: #ededed;
  }
`;

const Sidebar = forwardRef(({ className }, ref) => {
  const [active, setActive] = useState('');
  const { user } = useContext(UserContext);

  const items = {
    'account': 'Minha conta',
    'musics': 'Minhas músicas',
    
  };

  const handleItemClick = (key) => {
    setActive(key);
  };

  return (
    <Aside className={className} ref={ref}>
      <CircleButton 
        className="show-on-mobile mt-2 ms-2"
        onClick={() => {
          ref.current.classList.remove('active');
        }}
      >
        <FontAwesomeIcon icon={solid('arrow-left')} size="xl" />
      </CircleButton>
      <div>
        <Avatar />
        <h5 className="fw-bold text-center mt-2 theme-text" translate="no">{user?.name}</h5>
      </div>
      <nav className="mt-3">
        <ul className="list-unstyled">
          {
            Object.keys(items).map((key, i) => (
              <li key={i}>
                <Navitem 
                  to={key}
                  className={`theme-text hover-themed-btn ${active === key && 'active'}`}
                  onClick={() => handleItemClick(key)}
                >
                  {items[key]}
                </Navitem>
              </li>
            ))
          }
        </ul>
      </nav>
    </Aside>
  );
});

export default Sidebar;