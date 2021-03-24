import { useEffect, useRef, useState } from 'react';

import { useSocket } from './socket';
import Marker from './Marker';
import Controls from './Controls';

const enterFull = (node) => {
  if (node.requestFullscreen) {
    node.requestFullscreen();
  } else if (node.mozRequestFullScreen) {
    node.mozRequestFullScreen();
  } else if (node.webkitRequestFullscreen) {
    node.webkitRequestFullscreen();
  } else if (node.msRequestFullscreen) {
    node.msRequestFullscreen();
  }
};
const exitFull = (node) => {
  if (node.exitFullscreen) {
    node.exitFullscreen();
  } else if (node.mozCancelFullScreen) {
    node.mozCancelFullScreen();
  } else if (node.webkitExitFullscreen) {
    node.webkitExitFullscreen();
  } else if (node.msExitFullscreen) {
    node.msExitFullscreen();
  }
};

const Player = () => {
  const videoRef = useRef(null);
  const parentRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const { socket, getJSONData } = useSocket();
  const [state, setState] = useState({
    time: 0,
    duration: 0,
    paused: undefined,
    isFull: false
  });
  const merge = (value = {}) => {
    setState((s) => ({
      ...s,
      ...value
    }));
  };
  const { time, paused, isFull } = state;

  useEffect(() => {
    const videoEl = videoRef.current;
    const onLoaded = (e) => {
      merge({ duration: e.target.duration });
    };
    const onTimeUpdate = (e) => {
      const { currentTime, paused } = e.target;
      merge({ time: currentTime, paused });
    };
    const onFullscreenChange = () => {
      if (document.fullscreenElement) {
        merge({ isFull: true });
      } else {
        merge({ isFull: false });
      }
    };

    videoEl.addEventListener('loadedmetadata', onLoaded);
    videoEl.addEventListener('timeupdate', onTimeUpdate);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      videoEl.removeEventListener('loadedmetadata', onLoaded);
      videoEl.removeEventListener('timeupdate', onTimeUpdate);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (msg) => {
        const data = getJSONData(msg);

        if (data.type === 'marker') {
          const { marker, success } = data;
          setMarkers((m) => [...m, marker]);
          if (success) {
            alert(`Message success - ${marker.id}`);
          }
        }
      };
    }
  }, [getJSONData, socket]);

  const seek = (position) => {
    videoRef.current.currentTime = position;
  };
  const playback = () => {
    if (paused === undefined || paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };
  const handleFullscreen = () => {
    if (isFull) {
      exitFull(document);
    } else {
      enterFull(parentRef.current);
    }
  };

  return (
    <div className="player">
      <div className="parent" ref={parentRef}>
        <video ref={videoRef}>
          <source src="/Big_Buck_Bunny_1080_10s_5MB.mp4" type="video/mp4" />
          <p>Sorry, your browser does not support embedded videos</p>
        </video>
        <div className="marker-list">
          {markers.map((marker) => (
            <Marker key={marker.id} time={time} paused={paused} {...marker} />
          ))}
        </div>
        <Controls
          {...state}
          seek={seek}
          playback={playback}
          handleFullscreen={handleFullscreen}
        />
      </div>
    </div>
  );
};

export default Player;
