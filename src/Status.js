import { useSocket } from './socket';

const Status = () => {
  const { isOpen, init } = useSocket();

  return (
    <div className="status">
      <strong data-open={isOpen}>• {isOpen ? 'Online' : 'Offline'} •</strong>
      {!isOpen && <button type="button" onClick={init}>Connect</button>}
    </div>
  );
};

export default Status;
