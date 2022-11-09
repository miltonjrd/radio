import { ReactComponent as AlertIcon } from '../svg/icon-alert.svg';
import { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PopupContext } from '../context/PopupContext';
import { UserContext } from '../context/UserContext';
import styled from 'styled-components';
import api from '../api/api';

const Avatar = styled.div`
  height: 45px;
  width: 45px;
`;

const AccountDropdown = () => {
  const { dispatchPopup } = useContext(PopupContext);
  const handleLogOut = async () => {
    const { data, error } = await api.del('/auth');

    if (data) 
      dispatchPopup({
        title: 'Sucesso',
        content: data.message
      });

    if (error)
      dispatchPopup({
        title: 'Erro',
        content: error.response.data.message
      });
  };

  return (
    <Dropdown>
      <Dropdown.Toggle className="bg-transparent border-0 caret-off p-0 rounded-circle">
        <Avatar className='bg-primary rounded-circle' />
      </Dropdown.Toggle>
      <Dropdown.Menu className="theme-bg-secondary">
        <Dropdown.Item as={Link} to="/manager/musics" className="theme-text">
          Minha conta
        </Dropdown.Item >
        <Dropdown.Item onClick={handleLogOut} className="theme-text">
          Sair
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
      
  );
};

export default AccountDropdown;