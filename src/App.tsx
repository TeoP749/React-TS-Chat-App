import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import ChatView from './components/chat/ChatView';
import { Message } from './components/message/MessageCard';
import ResizableSidebar from './components/sidebar/ResizableSidebar';
import UsernameSelection from './components/users/UsernameSelection';
import UsersView from './components/users/UsersView';
import { socket } from './socket';

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export type User = {
  userID: string;
  username: string;
  self: boolean;
  connected?: boolean;
  unread_messages?: number;
  messages?: Message[];
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

const empty_user: User = {
  userID: "",
  username: "",
  self: false,
};

function App() {
  const testing: boolean = false;
  const [usernameSelected, setUsernameSelected] = useState<boolean>(false);
  const [selfUser, setSelfUser] = useState<User>(empty_user);
  const [selectedUser, setSelectedUser] = useState<User>(empty_user);
  const [users, setUsers] = useState<User[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState<number>(200);

  const setUserMessages = (userID: string, updateCallback: (prevMessages: Message[] | undefined) => Message[]) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.userID === userID
          ? { ...user, messages: updateCallback(user.messages || []) }
          : user
      )
    );
  };

  useEffect(() => {
    socket.on("connect", () => {
      users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
    });

    socket.on("disconnect", () => {
      users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

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
        if (prevUsers.find((u) => u.userID === user.userID)) {
          return prevUsers;
        }

        const newUser = processUser(user);
        return [...prevUsers, newUser].sort(sortUsers);
      });
    });

    socket.on("user disconnected", (id) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
    });
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameSelected(false);
        setSelfUser(empty_user);
      }
    });

    return () => {
      socket.off("connect_error");
    };
  }, []);

  const handleUsernameSelection = (username: string) => {
    setUsernameSelected(true);
    const self: User = { userID: uuidv4(), username, self: true, connected: true, unread_messages: 0, messages: [] };
    setSelfUser(self);
    socket.auth = { id: self.userID, username };
    socket.connect();
  }

  return (
    <>
      {
        usernameSelected || testing
          ?
          <div className="flex items-start bg-base-100 size-full gap-0">
            <ResizableSidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} >
              <UsersView users={users} selfUser={selfUser} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            </ResizableSidebar>
            <div className="w-full h-screen">
              <ChatView selected_user={selectedUser} selfUser={selfUser} setUserMessages={setUserMessages} />
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
