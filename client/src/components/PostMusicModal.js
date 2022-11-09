import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import { PopupContext } from '../context/PopupContext';
import ButtonSpinner from "./ButtonSpinner";
import styled from "styled-components";
import api from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const DropZoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  border-radius: .5rem;
  transition: all .2s;

  &.active {
    background: var(--bs-purple);
    color: #fff;
    border-color: #000;

    label {
      background: #fff;
      color: #000;
    }

    * {
      pointer-events: none;
    }
  }

`;

const ShadowLabel = styled.label`
  border-radius: .25rem;
  box-shadow: 0 .25rem .25rem rgb(0, 0, 0, .25);
`;

const DropZone = ({ children, onDrop, style, accept }) => {
  const handleDragEnter = evt => {
    evt.preventDefault();
    evt.target.classList.add('active');
  };

  const handleDragLeave = evt => {
    evt.preventDefault();
    evt.target.classList.remove('active');
  };

  const handleDrop = evt => {
    evt.preventDefault();
    evt.target.classList.remove('active');
    
    const file = evt.dataTransfer.files[0];
    onDrop(file);
  };

  const handleFileChange = evt => {
    const file = evt.target.files[0];
    console.log('arquivo:', file)
    onDrop(file);
  };

  const preventDefault = evt => evt.preventDefault();

  return (
    <DropZoneContainer
      style={style}
      onDragOver={preventDefault}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      <ShadowLabel className="btn btn-primary px-5 mt-2">
        <input 
          type="file" 
          className="d-none" 
          onChange={handleFileChange} 
          accept={accept}
        />
        Selecione
      </ShadowLabel>
    </DropZoneContainer>
  );
};

const PostMusicModal = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: null,
    visibility: 'public',
    audio_file: null,
    thumb_file: null
  });
  const [formShow, setFormShow] = useState(false);
  const { dispatchPopup } = useContext(PopupContext);
  const navigate = useNavigate();

  const handleInputChange = evt => {
    const name = evt.target.name;
    const value = evt.target.value;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleFormSubmit = async evt => {
    evt.preventDefault();

    const formData = new FormData();

    for (let key in form) {
      if (form[key])
        formData.append(key, form[key]);
    }

    setLoading(true);
    const { data, error } = await api.post('musics', formData, {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    });
    setLoading(false);

    if (error)
      return dispatchPopup({
        title: 'Erro',
        content: error.message
      });

    if (data) {
      navigate(-1);
      return dispatchPopup({
        title: 'Sucesso',
        content: data.message
      });
    }
    
  };

  return (
    <Modal show centered size="lg">
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <button 
            className="bg-transparent border-0"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={solid('xmark')} size="lg" />
          </button>
        </div>
        {
          !formShow ?
          <div>
            <DropZone 
              accept="audio/*"
              onDrop={file => {
                if (!/audio\/[a-z]+/.test(file.type))
                  return dispatchPopup({
                    title: 'Erro',
                    content: 'Você só pode fazer o upload de arquivos de audio.'
                  });
                setForm({
                  ...form,
                  audio_file: file
                });
                setFormShow(true);
              }} 
            >
              <div className="text-center">
                Arraste e solte o seu arquivo de audio aqui!<br />ou
              </div>
            </DropZone>
          </div> :
          <form name="music" className="d-flex flex-column gap-3" onSubmit={handleFormSubmit}>
            <h5>Envie uma música</h5>
            <div 
              style={{
                height: '1px'
              }}
              className="border-bottom"
            />
            <div className="d-flex gap-2">
              <div className="d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                <div>
                  <div className="form-floating">
                    <input 
                      id="musicTitle" 
                      name="title" 
                      className="form-control" 
                      placeholder="Titulo da música"
                      onChange={handleInputChange}
                    />
                    <label for="musicTitle">Titulo da música</label>
                  </div>
                  <small className="d-block text-muted mt-2 ms-2" style={{ lineHeight: 1.15 }}>
                    Dica: no formato "autor [feats] - nome da música".<br />
                    Exemplos: cleitin - rap do free fire, cleitao ft. grande homem - trabalhar, trabalhar
                  </small>
                </div>
                <div className="form-floating">
                  <select 
                    id="musicVisibility" 
                    name="visibility"
                    className="form-select"
                    value="public"
                    onChange={handleInputChange}
                  >
                    <option value="private">Privado</option>
                    <option value="non-listed">Não listado</option>
                    <option value="public">Publico</option>
                  </select>
                  <label for="musicVisibility">Visibilidade</label>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <DropZone
                  accept="image/*"
                  style={{
                    position: 'relative',
                    border: '1px solid #dee2e6'
                  }}
                  onDrop={file => {
                    if (!/image\/[a-z]+/.test(file.type))
                      return dispatchPopup({
                        title: 'Erro',
                        content: 'Você só pode fazer o upload de arquivos de imagem.'
                      });
                    setForm({ ...form, thumb_file: file });
                  }}
                >
                  <small className="position-absolute start-0 top-0 mt-2 ms-2 text-muted">Opcional</small>
                  <div className="text-center">
                    Arraste e solte a miniatura da sua música<br/>ou
                  </div>
                </DropZone>

              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-danger"
                onClick={() => setFormShow(false)}
                type="button"
              >
                Voltar
              </button>
              <ButtonSpinner
                className="btn btn-primary"
                type="submit"
                title="Enviar"
                active={loading}
                disabled={loading}
              />
            </div>

          </form>
        }
        
      </Modal.Body>
    </Modal>
  );
};

export default PostMusicModal;