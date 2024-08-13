import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import ChatView from './components/chat/ChatView';
import { Message } from './components/message/MessageCard';
import ResizableSidebar from './components/sidebar/ResizableSidebar';
import UsernameSelection from './components/users/UsernameSelection';
import UsersView from './components/users/UsersView';
import { socket } from './socket';

socket.onAny((event, ...args): void => {
  console.log(event, args);
});

export type User = {
  userID: string;
  username: string;
  self: boolean;
  connected?: boolean;
  unread_messages?: number;
};

export type MessageStore = {
  [key: string]: Message[];
};

export type UserStore = {
  [key: string]: User;
};

const sortUsers = (a: User, b: User): number => {
  if (a.self) return -1;
  if (b.self) return 1;
  if (a.username < b.username) return -1;
  return a.username > b.username ? 1 : 0;
};

const processUser = (user: { userID: string; username: string; }): User => {
  return {
    userID: user.userID,
    username: user.username,
    connected: true,
    unread_messages: 0,
    self: false,
  };
};

const empty_user: User = {
  userID: "",
  username: "",
  self: false,
};

export const emitPrivateMessage = (message: Message, to: string): void => {
  socket.emit("private message", { message, to });
};

const getSortedUsers = (users: UserStore): User[] => {
  return Object.values(users).sort(sortUsers);
};

export default function App() {
  const testing: boolean = false;
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [selfUser, setSelfUser] = useState<User>(empty_user);
  const [selectedUser, setSelectedUser] = useState<User>(empty_user);
  const [users, setUsers] = useState<UserStore>({});
  const [messages, setMessages] = useState<MessageStore>({});
  const [sidebarWidth, setSidebarWidth] = useState<number>(200);

  const setUserMessages = (userID: string, updateCallback: (prevMessages: Message[] | undefined) => Message[]) => {
    setMessages(prevMessages =>
    ({
      ...prevMessages,
      [userID]: updateCallback(prevMessages[userID])
    })
    );
  };

  const changeUnreadMessageCount = (userID: string, updateCallback: (prevUnreadMessagesCount: number | undefined) => number) => {
    if (!users[userID]) return;
    setUsers(prevUsers => {
      return {
        ...prevUsers,
        [userID]: {
          ...prevUsers[userID],
          unread_messages: updateCallback(prevUsers[userID].unread_messages)
        }
      };
    });
  }

  const onSelfMessage = (message: Message): void => {
    setUserMessages(selectedUser.userID, (prevMessages: Message[] | undefined): Message[] => [...(prevMessages || []), message]);
    emitPrivateMessage(message, selectedUser.userID);
  }

  //when username is selected, create a user object and set it as the self user
  useEffect(() => {
    console.log("changing self user with username: ", selectedUsername);
    if (!selectedUsername || selectedUsername.trim() === "") return;
    const self: User = { userID: uuidv4(), username: selectedUsername, self: true, connected: true, unread_messages: 0 };
    setSelfUser(self);
  }, [selectedUsername]);

  //when self user is set, connect the socket
  useEffect(() => {
    console.log("self user changed to: ", selfUser);
    if (!selfUser.userID || selfUser.userID.trim() === "") return;
    socket.auth = { id: selfUser.userID, username: selfUser.username };
    socket.connect();

  }, [selfUser]);

  //when the selected user changes, reset the unread messages count
  useEffect(() => {
    if (selectedUser.userID === "") return;
    changeUnreadMessageCount(selectedUser.userID, () => 0);
  }, [selectedUser]);

  useEffect(() => {
    socket.on("users", (users: [{ userID: string; username: string; }]) => {
      console.log("received users")
      console.log("self user: ", selfUser);
      const processedUsers: UserStore = users
        .map((user: { userID: string; username: string; }) => processUser(user))
        .sort(sortUsers)
        .reduce((acc, user: User) => ({ ...acc, [user.userID]: user }), {});

      console.log("processed users: ", processedUsers);
      setUsers(processedUsers);
    });

    socket.on("user connected", (user: { userID: string, username: string }) => {
      console.log("user connected - " + user.username);
      setUsers((prevUsers) => {
        const newUser = processUser(user);
        console.log("new user: ", newUser);
        return {
          ...prevUsers,
          [newUser.userID]: newUser
        }
      });
    });

    socket.on("user disconnected", (id) => {
      setUsers((prevUsers) => {
        return {
          ...prevUsers,
          [id]: {
            ...prevUsers[id],
            connected: false
          }
        };
      });
      if (selectedUser.userID === id) {
        setSelectedUser(empty_user);
      }
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setSelectedUsername("");
        setSelfUser(empty_user);
      }
    });

    socket.on('private message', ({ from, message }) => {
      setUserMessages(from, (prevMessages: Message[] | undefined): Message[] => [...(prevMessages || []), message]);

      if (selectedUser.userID !== from) {
        console.log("FROM: ", from);
        console.log("user ids: ", users[from]);
        console.log("PREV UNREAD MESSAGES: ", users[from].unread_messages);
        changeUnreadMessageCount(from, (prevUnreadMessagesCount: number | undefined): number => (prevUnreadMessagesCount || 0) + 1);
      }
    });

    return () => {
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("connect_error");
      socket.off("private message");
    };
  }, [selfUser, users]);

  return (
    <>
      {
        selectedUsername && selectedUsername.trim() !== "" || testing
          ?
          <div className="flex items-start bg-base-100 size-full gap-0">
            <ResizableSidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} >
              <UsersView users={getSortedUsers(users)} selfUser={selfUser} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            </ResizableSidebar>
            <div className="w-full h-screen">
              <ChatView selected_user={selectedUser} selfUser={selfUser} messages={messages[selectedUser.userID] || []} onSelfMessage={onSelfMessage} />
            </div>
          </div>
          :
          <div className="flex items-center justify-center h-screen w-full">
            <UsernameSelection setSelectedUsername={setSelectedUsername} />
          </div>
      }
    </>
  )
}
