import { ReactComponent as MusicNoteIcon } from '../svg/icon-music-note.svg';
import { ReactComponent as ClockIcon } from '../svg/icon-clock.svg';
import { MusicPlayerContext } from '../context/MusicPlayerContext';
import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import api from '../api/api';

import styled from 'styled-components';
import '../sass/cards.scss';

const Title = styled.h6`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-bottom: .25rem;
  overflow: hidden;
`;

const Thumb = styled.div`
  background: var(--bs-purple);
  height: 125px;
  border-radius: .5rem;
`;

const MusicCard = (music) => {
  const { status: playerStatus, setStatus: setPlayerStatus } = useContext(MusicPlayerContext);
  const { title, thumb_path, audio_path, username, duration, skeleton } = music;
  return (
    <>
      {
        skeleton ?
        <div
          style={{
            flex: '1 0 0'
          }}
        >
          <Thumb className="skeleton" />
          <div className="d-flex flex-column gap-2 mt-2">
            <div className="skeleton skeleton-inline"></div>
            <div className="skeleton skeleton-inline w-75"></div>
            <div className="d-flex flex-column gap-1">
              <div className="skeleton skeleton-inline-sm w-50"></div>
              <div className="skeleton skeleton-inline-sm w-50"></div>
            </div>
          </div>
        </div> :
        <article 
          className="music-card theme-border theme-bg-lighter"
          onClick={evt => {
            evt.stopPropagation();
            setPlayerStatus({ ...playerStatus, active: true, music })
          }}
        >
          <Thumb style={{ background: `url(${api.media(thumb_path)}) center center / contain no-repeat` }} />
          
          <div 
            className='text-secondary p-2 position-relative'
            style={{
              flex: 1
            }}
          >
            <Title className="theme-text" translate='no'>{title}</Title>
            <small className="d-inline-flex align-items-center">
              <FontAwesomeIcon icon={solid('music')} />
              <span className="ms-2">Ouvida x vezes</span>
            </small><br />
            <small className="d-inline-flex align-items-center">
              <FontAwesomeIcon icon={regular('clock')} />
              <span className="ms-2">
                {
                  (() => {
                    const minutes = Math.floor(duration / 60);
                    const seconds = Math.floor(duration % 60);

                    const mf = minutes < 10 ? '0'+minutes : minutes;
                    const sf = seconds < 10 ? '0'+seconds : seconds;

                    return `${mf}:${sf}`;
                  })()
                }
              </span>
            </small><br />
            <small className="position-absolute bottom-0" translate='no'>{username}</small>
          </div>
        </article>
      }
      
    </>
  );
};

export { MusicCard };