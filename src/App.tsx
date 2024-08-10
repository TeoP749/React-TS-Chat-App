import { useEffect, useState } from 'react';
import './App.css';
import ChatView from './components/chat/ChatView';
import ResizableSidebar from './components/sidebar/ResizableSidebar';
import UsernameSelection from './components/users/UsernameSelection';
import { socket } from './socket';
import UsersView from './components/users/UsersView';

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export type User = {
  userID: string;
  username: string;
  self: boolean;
};

const sortUsers = (a: User, b: User) => {
  if (a.self) return -1;
  if (b.self) return 1;
  if (a.username < b.username) return -1;
  return a.username > b.username ? 1 : 0;
};

const processUser = (user: { userID: string; username: string; }) => {
  return {
    userID: user.userID,
    username: user.username,
    self: user.userID === socket.id,
  };
};

function App() {
  const testing: boolean = false;
  const [selectedUsername, setSelectedUsername] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sidebarWidth, setSidebarWidth] = useState<number>(200);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on("users", (users) => {
      console.log("received users")
      const processedUsers: User[] = users
        .map(processUser)
        .sort(sortUsers);

      setUsers(processedUsers);
    });

    socket.on("user connected", (user: User) => {
      console.log("user connected - " + user.username);
      setUsers((prevUsers) => {
        const newUser = processUser(user);
        return [...prevUsers, newUser].sort(sortUsers);
      });
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setSelectedUsername("");
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("connect_error");
    };
  }, []);

  useEffect(() => {
    console.log("connected status: ", isConnected);
  }, [isConnected]);

  const handleUsernameSelection = (username: string) => {
    setSelectedUsername(username);
    socket.auth = { username };
    socket.connect();
  }

  return (
    <>
      {
        testing || (selectedUsername !== null && selectedUsername !== "")
          ?
          <div className="flex items-start bg-base-100 size-full gap-0">
            <ResizableSidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} >
              <UsersView users={users} selectedUsername={selectedUsername} />
            </ResizableSidebar>
            <div className="w-full h-screen">
              <ChatView self_username={selectedUsername} />
            </div>
          </div>
          :
          <div className="flex items-center justify-center h-screen w-full">
            <UsernameSelection handleUsernameSelection={handleUsernameSelection} />
          </div>
      }

    </>

  )
}

export default App
