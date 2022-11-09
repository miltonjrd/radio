import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { PopupContext } from '../context/PopupContext';
import { UserContext } from '../context/UserContext';
import { ReactComponent as EyeIcon } from '../svg/icon-eye.svg';
import { ReactComponent as EyeIconSlash } from '../svg/icon-eye-slash.svg';
import api from '../api/api';
import ButtonSpinner from './ButtonSpinner';
import styled from 'styled-components';

const EyeButton = styled.button`
  position: absolute;
  top: 50%;
  right: 2rem;
  background: transparent;
  border: none;
  transform: translateY(-50%)
`;

const RegisterModal = () => {
  const [loading, setLoading] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { dispatchPopup } = useContext(PopupContext);
  const { user } = useContext(UserContext);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const regex = {
      name: /^[A-Za-z0-9_]{4,}$/g,
      email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      password: /^[^ ]+$/
    };

    const body = {
      name: evt.target.name.value,
      email: evt.target.email.value,
      password: evt.target.password.value,
      confirm_password: evt.target.confirm_password.value
    };

    for (const key in regex) {
      if (!regex[key].test(body[key]))
        return dispatchPopup({
          title: 'Erro',
          content: `O campo ${key} não é válido`
        });
    }

    setLoading(true);
    setSubmitEnabled(false);
    const { data, error } = await api.post('users', body);

    if (data)
      dispatchPopup({
        title: 'Sucesso',
        content: data.message
      });

    if (error)
      dispatchPopup({
        title: 'Erro',
        content: error.message
      });

    setLoading(false);
    setSubmitEnabled(true);
  };

  const handleInputChange = (evt) => {
    const regex = {
      name: /^[A-Za-z0-9_]{4,}$/g,
      email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      password: /^[^ ]+$/
    };

    const name = evt.target.name;
    const value = evt.target.value;
    const form = evt.target.form;

    if (name === 'confirm_password') {
      if (value === '' || value !== form.password.value) {
        evt.target.classList.add('is-invalid');
        evt.target.classList.remove('is-valid');
      } else {
        evt.target.classList.add('is-valid');
        evt.target.classList.remove('is-invalid');
      }
      return;
    }
    
    if (!regex[name].test(value)) {
      evt.target.classList.add('is-invalid');
      evt.target.classList.remove('is-valid');
    } else {
      evt.target.classList.add('is-valid');
      evt.target.classList.remove('is-invalid');
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <Modal show={true} centered={true}>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <h4 className="text-center mb-4">Crie uma conta</h4>
          <div className='d-flex flex-column gap-3'>
            <div className="form-floating">
              <input 
                id="name" 
                name="name" 
                className="form-control" 
                placeholder='Nome de usuário' 
                autoComplete='off' 
                onChange={handleInputChange}
              />
              <label for="name">Nome de usuário</label>
            </div>
            <div className="form-floating">
              <input 
                id="email" 
                name="email" 
                className="form-control" 
                placeholder='E-mail' 
                autoComplete='off' 
                onChange={handleInputChange}
              />
              <label for="email">E-mail</label>
            </div>
            <div className="form-floating d-flex">
              <input 
                id="password" 
                name="password" 
                className="form-control" 
                placeholder="Senha" 
                type={showPassword ? 'text' : 'password'}
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
            <div className="form-floating">
              <input 
                id="confirm_password" 
                name="confirm_password" 
                className="form-control" 
                placeholder="Confirme sua senha" 
                type={showPassword ? 'text' : 'password'}
                onChange={handleInputChange}
              />
              <label for="confirm_password">Confirme sua senha</label>
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
              title={'Registrar'} 
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
              Já possuí uma conta?&nbsp;
              <Link to="/login">Entrar</Link>
            </small>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;