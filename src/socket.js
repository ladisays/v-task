import React, { useEffect, useState, useCallback, useContext } from 'react';

const SocketContext = React.createContext({
  socket: null,
  isOpen: false,
  init() {},
  getJSONData() {}
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const getJSONData = (msg) => {
    let data;

    try {
      data = JSON.parse(msg.data);
    } catch {
      data = {};
    }
    return data;
  };
  const init = useCallback(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_SERVER);
    ws.onopen = () => {
      setOpen(ws.readyState === WebSocket.OPEN);
    };
    ws.onerror = (e) => {
      console.log('error', e);
    };
    ws.onclose = () => {
      setOpen(false);
    };
    setSocket(ws);
    return ws;
  }, []);

  useEffect(() => {
    const ws = init();
    return () => {
      ws.close();
    };
  }, [init]);

  const contextValue = { init, socket, isOpen, getJSONData };

  return (
    <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const { socket, isOpen, ...rest } = useContext(SocketContext);

  const send = (data) => {
    if (socket && isOpen) {
      socket.send(JSON.stringify(data));
    } else {
      throw new Error('Server not available');
    }
  };

  return { socket, send, isOpen, ...rest };
};
