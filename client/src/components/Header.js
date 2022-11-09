import { ReactComponent as SearchIcon } from '../svg/icon-search.svg';
import { ReactComponent as MoonIcon } from '../svg/icon-moon.svg';
import { forwardRef, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import NotificationsDropdown from './NotificationsDropdown';
import AccountDropdown from './AccountDropdown';
import styled from 'styled-components';
import '../sass/header.scss';
import useApi from '../api/useApi';

const SearchInput = styled.input`
  width: 400px;
`;

const TransparentButton = styled.button`
  background: transparent;
  border: none;
`;

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  const { data, error } = useApi({ method: 'get', url: 'auth' });

  useEffect(() => {
    if (!error && data)
      setUser(_ => data);
  }, [data]);

  return (
    <header className="header border-bottom theme-bg-primary theme-border-color">
      <div className="container h-100 d-flex align-items-center justify-content-between">
        <h4>
          <Link to="/" className="theme-text text-decoration-none">LOGO</Link>
        </h4>

        <form className="d-flex hide-on-mobile">
          <SearchInput 
            className="rounded-start ps-3 theme-border theme-bg-secondary theme-text"
            placeholder="Pesquise uma música, cantor ou categoria" 
          />
          <button 
            className="btn btn-primary d-flex rounded-0 rounded-end py-2 px-3"
            type="submit"
          >
            <FontAwesomeIcon icon={solid('magnifying-glass')} size="lg" />
          </button>
        </form>

        <div className="d-flex align-items-center gap-3 py-1 h-100">
          {
            !error && !data ?
            <>
              <span className="skeleton skeleton-circle-sm" />
              <span className="skeleton skeleton-circle-sm" />
              <span className="skeleton skeleton-circle-sm" />
            </> :
            !user ?
            <>
              <Link className="btn btn-outline-primary btn-sm" to="/register">Cadastrar-me</Link>
              <Link className="btn btn-primary btn-sm" to="/login">Entrar</Link>
            </> :
            <>
              <TransparentButton className="text-primary header-btn hover-themed-btn">
                <FontAwesomeIcon icon={solid('moon')} size="xl" />
              </TransparentButton>
              <NotificationsDropdown />
              <AccountDropdown />
            </>
          }
        </div>
      </div>
      
    </header>
  );
};

export default Header;