import { useRef } from 'react';
import './controls.css';

const formatTime = (time) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time - mins * 60);
  let left = mins;
  let right = secs;

  if (mins < 10) {
    left = `0${mins}`;
  }
  if (secs < 10) {
    right = `0${secs}`;
  }
  return `${left}:${right}`;
};

const Controls = ({ playback, paused, time, duration, seek, handleFullscreen }) => {
  const bar = useRef(null);
  const progressStyle = { width: `${(time / duration) * 100.0}%` };

  const onSeek = (event) => {
    const { offsetX } = event.nativeEvent;
    const { offsetWidth } = bar.current;
    const position = duration * (offsetX / offsetWidth);
    seek(position);
  };

  return (
    <div className="controls">
      <button type="button" onClick={playback}>
        {paused === undefined || paused ? 'Play' : 'Pause'}
      </button>
      <div className="progress">
        <button ref={bar} type="button" onClick={onSeek}>
          <div style={progressStyle} />
        </button>
        <span>{formatTime(time)} / {formatTime(duration)}</span>
      </div>
      <button type="button" onClick={handleFullscreen}>
        Full
      </button>
    </div>
  );
};

export default Controls;
