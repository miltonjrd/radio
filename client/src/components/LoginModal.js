import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { PopupContext } from '../context/PopupContext';
import { UserContext } from '../context/UserContext';
import { ReactComponent as EyeIcon } from '../svg/icon-eye.svg';
import { ReactComponent as EyeIconSlash } from '../svg/icon-eye-slash.svg';
import styled from 'styled-components';
import api from '../api/api';
import ButtonSpinner from './ButtonSpinner';

const EyeButton = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  background: transparent;
  border: none;
  transform: translateY(-50%)
`;

const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [form, setForm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { dispatchPopup } = useContext(PopupContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    
    setForm({ ...form, [name]: value })
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const body = {
      identifier: form.identifier,
      password: form.password,
    };

    setLoading(true);
    setSubmitEnabled(false);
    const { data, error } = await api.post('auth', body);
    setUser(data);
    if (data) {
      dispatchPopup({
        title: 'Sucesso',
        content: data.message
      });
      sessionStorage.setItem('auth', data.token);
    }
    
    if (error)
      dispatchPopup({
        title: 'Erro',
        content: error.message
      });
    setLoading(false);
    setSubmitEnabled(true);
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <Modal show={true} centered={true}>
      <Modal.Body className="theme-bg-secondary">
        <form onSubmit={handleSubmit}>
          <h4 className="theme-text text-center mb-4">Entre na sua conta</h4>
          <div className='d-flex flex-column gap-3'>
            <div className="form-floating">
              <input 
                id="identifier" 
                name="identifier" 
                className="form-control" 
                placeholder='Nome de usuário ou e-mail' 
                autoComplete='off'
                onChange={handleInputChange}
              />
              <label for="name">Nome de usuário ou e-mail</label>
            </div>
            <div className="form-floating d-flex">
              <input 
                id="password" 
                name="password" 
                className="form-control pe-5" 
                placeholder="Senha" 
                type={showPassword ? 'text' : 'password'} 
                style={{
                  flex: 1
                }}
                onChange={handleInputChange}
              />
              <EyeButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {
                  showPassword ?
                  <EyeIconSlash /> :
                  <EyeIcon />
                }
              </EyeButton>
              <label for="password">Senha</label>
              
            </div>
          </div>
          
          <div className="d-flex justify-content-between gap-3 mt-3">
            <button 
              className="btn btn-danger" 
              type="button"
              style={{
                flex: '1 0 0'
              }}
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
            <ButtonSpinner 
              title={'Entrar'} 
              active={loading} 
              type="submit" 
              style={{
                flex: '1 0 0'
              }} 
              disabled={!submitEnabled}
            />
          </div>

          <div className='mt-3 text-center'>
            <small>
              Não possui uma conta?&nbsp;
              <Link to="/register">Faça seu registro</Link>
            </small>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;