import { useState, useContext } from "react";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { UserContext } from "../context/UserContext";
import { MusicPlayerContext } from '../context/MusicPlayerContext';
import api from "../api/api";
import useApi from "../api/useApi";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import ButtonSpinner from "./ButtonSpinner";

const CardContainer = styled.article`
  display: flex;
  gap: 1rem;
  background: #fff;
  height: 140px;
  width: 100%;
  border: 1px solid var(--theme-border);
  padding: .5rem;

  &:not(:first-child) {
    border-top: none;
  }
`;

const ThumbContainer = styled.div`
  background: lightgray;
  height: 100%;
  width: 125px;
`;

const CardTitle = styled.h6`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Input = styled.input`
  display: block;
  height: 25px;
  width: 400px;
  padding: .25rem;
  border: 1px solid var(--bs-secondary);
  border-radius: .25rem;
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

const Card = ({ skeleton, title, visibility, created_at, thumb_path, audio_path, setEditing }) => {
  const { status: playerStatus, setStatus: setPlayerStatus } = useContext(MusicPlayerContext);
  const music = { title, visibility, thumb_path, audio_path };

  return (
    <>
      {
        skeleton ?
        <div className="d-flex p-2" style={{ height: '125px' }}>
          <div
            className="skeleton h-100 rounded"
            style={{ width: '125px' }}
          />
          <div className="d-flex flex-column gap-2 w-50 py-2 ms-3">
            <div className="skeleton skeleton-inline" />
            <div className="skeleton skeleton-inline w-75" />
          </div>
        </div> :
        <CardContainer className="theme-bg-primary">
          <ThumbContainer 
            className="theme-border"
            style={{
              background: `url(${api.media(thumb_path)}) center center / contain no-repeat`
            }}
          />
          <div className="position-relative" style={{ flex: 1 }}>
            <div>
              <CardTitle className="theme-text" translate="no">{title}</CardTitle>
              <span className="text-muted">{created_at}</span><br />
              <span className="text-muted">2:30</span>
            </div>
            <div className="position-absolute d-flex gap-2 bottom-0">
              <CircleButton
                onClick={() => setEditing(music)}
              >
                <FontAwesomeIcon icon={solid('pencil')} />
              </CircleButton>
              <CircleButton>
                <FontAwesomeIcon icon={solid('trash')} />
              </CircleButton>
              <CircleButton
                onClick={() => setPlayerStatus({ ...playerStatus, active: true, music })}
              >
                <FontAwesomeIcon icon={solid('play')} />
              </CircleButton>
            </div>
          </div>
        </CardContainer>
      }
    </>
  );
};

const Musics = () => {
  const [musicBeingEdit, setMusicBeingEdit] = useState(null);
  const { user } = useContext(UserContext);
  const { data:musics, error } = useApi({ method: 'get', url: `/musics/${user?.name}` });
  const { sidebarRef } = useOutletContext();

  return (
    <section className="d-flex flex-column h-100 p-3">
      <div className="d-flex">
        <div style={{ flex: 1 }}>
          <h4 className="theme-text">Minhas músicas</h4>
          <Link to="newMusic" className="btn btn-primary">
            <FontAwesomeIcon icon={solid('upload')} />
            <span className="ms-2">Nova música</span>
          </Link>
        </div>
        <button 
          className="bg-transparent border-0 show-on-mobile"
          onClick={() => {
            sidebarRef.current.classList.add('active');
          }}
        >
          <FontAwesomeIcon icon={solid('bars')} size="xl" />
        </button>
      </div>
      <div 
        className="mt-4" 
        style={{ 
          flex: 1,
          overflowY: 'scroll'
        }}
      >
        {
          !musics && !error ?
          new Array(6).fill(0).map(_ => <Card skeleton />) :
          (musics || []).map(music => (
            <Card {...music} setEditing={setMusicBeingEdit} />
          ))
        }
      </div>
      <Modal show={musicBeingEdit}>
        <Modal.Body>
          <form>
            <input 
              name="title" 
              className="form-control" 
              defaultValue={musicBeingEdit?.title}
              placeholder="Título"
            />
          </form>
        </Modal.Body>
      </Modal>
      <Outlet />
    </section>
  );
};

export default Musics;