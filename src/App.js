import './App.css';
import { SocketProvider } from './socket';
import Status from './Status';
import Player from './Player';
import VideoForm from './VideoForm';

function App() {
  return (
    <div className="app">
      <SocketProvider>
        <Status />
        <main>
          <Player />
          <VideoForm />
        </main>
      </SocketProvider>
    </div>
  );
}

export default App;
