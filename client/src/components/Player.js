import { ReactComponent as DeleteIcon } from '../svg/icon-delete.svg';
import { ReactComponent as PlayIcon } from '../svg/icon-play.svg';
import { ReactComponent as ControlNextIcon } from '../svg/icon-btn-next.svg';
import { ReactComponent as ControlPrevIcon } from '../svg/icon-btn-prev.svg';
import { ReactComponent as PauseIcon } from '../svg/icon-pause.svg';
import { ReactComponent as VolumeHighIcon } from '../svg/icon-volume-high.svg';
import { ReactComponent as VolumeOffIcon } from '../svg/icon-volume-slash.svg';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import api from '../api/api';
import styled from 'styled-components';

import '../sass/player.scss';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 5vw;
  display: flex;
  flex-direction: column;
  gap: .25rem;
  background: #fff;
  height: 350px;
  width: 400px;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: .25rem;
  z-index: 1000;
`;

const Thumb = styled.div`
  background: rgb(var(--bs-primary-rgb, .7));
  height: 125px;
  border-radius: .25rem;
`;

const TransparentButton = styled.button`
  background: transparent;
  border: none;
`;

const VolumeHandlerContainer = styled.span`
  &:hover div {
    display: flex !important;
  }
`;

const Player = ({ status, set }) => {
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audio, setAudio] = useState(null);
  const progressRef = useRef(null);

  const handleProgressBarMouseDown = (evt) => {
    if (!audio.paused)
      audio.pause();
    
    console.log('p')
  };

  const handleProgressBarMouseUp = () => {
    audio.play();
  };

  const handleProgress = (value, currentTime) => {
    value = value.toFixed(4);
    currentTime.toFixed(4);
    setProgress(value);
    setCurrentTime(currentTime);
    handleProgressRun(progressRef.current, value);
  };

  const handlePlayPause = () => {
    setIsPaused(!isPaused);
  };

  const handleClosePlayer = () => {
    audio && audio.currentTime > 0 && !audio.paused && !audio.ended && audio.pause();
    setAudio(null);
    
    set({ ...status, active: false, currentAudio: null });
  };

  const handleMuteBtn = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressInput = (evt) => {
    const value = evt.target.value;
    handleProgressRun(evt.target, value);
  };

  const handleProgressRun = (target, value) => {
    const rawStyle = `linear-gradient(to right, var(--bs-primary) 0%, var(--bs-primary) ${value}%, #dee2e6 ${value}%, #dee2e6 100%)`;
    target.style.background = rawStyle;
  };

  const handleVolumeChange = (evt) => {
    const value = evt.target.value / 100;

    if (value != 0) setIsMuted(false);

    audio.volume = value;
  };

  useEffect(() => {
    let interval = null;
    const audio = new Audio(api.media(status.music.audio_path));
    audio.preload = 'metadata';
    let duration = 0;

    audio.onloadedmetadata = function() {
      duration = audio.duration;
    }

    let currentTime = 0;
    audio.onplay = function() {
      interval = setInterval(() => {

        //const value = (((Math.floor(audio.currentTime) * 100) / audio.duration)).toFixed(4);
        if (currentTime + 1 <= duration) {
          currentTime += 1;
          const value = ((audio.currentTime * 100) / audio.duration);
          handleProgress(value, currentTime);
        }
      }, 1000);
    };

    audio.onpause = () => clearInterval(interval);
    audio.onend = () => clearInterval(interval);

    setAudio(state => {
      if (state && state.currentTime > 0 && !state.paused && !state.ended) {
        state.pause();
        audio.play();
      }
      return audio;
    });
    if (isPaused)
      setIsPaused(false);

    return () => {
      clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {

    if (audio)
      if (isPaused) audio.pause();
      else audio.play();
  }, [isPaused]);

  useEffect(() => {
    if (audio)
      if (isMuted)
        audio.volume = 0;
      else
        audio.volume = .5;
  }, [isMuted]);

  return (
    <Container>
      <div className="d-flex justify-content-end">
        <TransparentButton onClick={handleClosePlayer}>
          <DeleteIcon />
        </TransparentButton>
      </div>
      <Thumb
        style={{
          background: `url(${api.media(status.music.thumb_path)}) center center / contain no-repeat`
        }}
      />
      <div className="d-flex flex-column gap-3 p-1">
        <h6 className="text-center text-truncate">
          {status.music.title}
        </h6>
        <div className="d-flex">
          <div className="position-relative" style={{ flex: 1 }}>
            <VolumeHandlerContainer>
              <TransparentButton
                onClick={handleMuteBtn}
              >
                {
                  isMuted || audio?.volume === 0 ?
                  <FontAwesomeIcon icon={solid('volume-xmark')} /> :
                  audio?.volume < .5 ?
                  <FontAwesomeIcon icon={solid('volume-low')} /> :
                  <FontAwesomeIcon icon={solid('volume-high')} />
                }
                
              </TransparentButton>
              <div 
                className="position-absolute px-3 py-2 bottom-100" 
                style={{ 
                  display: 'none',
                  boxShadow: '0 .25rem .5rem rgb(0, 0, 0, .07)',
                  background: '#fff',
                  width: '125px'
                }}
              >
                <input 
                  type="range" 
                  className="player_progress" 
                  onInput={handleProgressInput} 
                  onChange={handleVolumeChange}
                />
              </div>
            </VolumeHandlerContainer>
            
          </div>
          <div className="d-flex justify-content-center gap-3">
            <TransparentButton>
              <FontAwesomeIcon icon={solid('backward-step')} size="lg" />
              {/*<ControlPrevIcon />*/}
            </TransparentButton>

            <TransparentButton 
              onClick={handlePlayPause}
              className={isPaused ? 'd-inline' : 'd-none'}
            >
              <FontAwesomeIcon icon={solid('play')} size="xl" />
            </TransparentButton>
            <TransparentButton 
              onClick={handlePlayPause}
              className={!isPaused ? 'd-inline' : 'd-none'}
            >
              <FontAwesomeIcon icon={solid('pause')} size="xl" />
            </TransparentButton>

            <TransparentButton>
              <FontAwesomeIcon icon={solid('forward-step')} size="lg" />
              {/*<ControlNextIcon />*/}
            </TransparentButton>
          </div>
          <div style={{ flex: 1 }} />
        </div>
        <input 
          ref={progressRef} 
          onInput={handleProgressInput} 
          onMouseDown={handleProgressBarMouseDown}
          onMouseUp={handleProgressBarMouseUp}
          className="player_progress" 
          type="range" 
          defaultValue={progress} 
          step="100.0000"
        />
        <small>
          {
            (() => {
              const minutes = Math.floor(currentTime / 60);
              const seconds = currentTime % 60;

              const mf = minutes < 10 ? '0'+minutes : minutes;
              const sf = seconds < 10 ? '0'+seconds : seconds;

              return `${mf}:${sf}`;
            })()
          } - {
            (() => {
              const duration = Math.round(audio?.duration);
              const minutes = Math.floor(duration / 60);
              const seconds = duration % 60;

              const mf = minutes < 10 ? '0'+minutes : minutes;
              const sf = seconds < 10 ? '0'+seconds : seconds;

              return `${mf}:${sf}`;
            })()
          }
          
          </small>
      </div>
    </Container>
  );
};

export default Player;