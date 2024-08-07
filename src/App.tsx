import { useEffect, useState } from 'react';
import './App.css';
import ChatView from './components/chat/ChatView';
import { socket } from './socket';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    console.log("connected status: ", isConnected);
  }, [isConnected]);

  return (
    <ChatView />
  )
}


export default App
