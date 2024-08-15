import { io } from 'socket.io-client';

const URL: string = 'react-ts-chat-app.up.railway.app';

export const socket = io(URL, { autoConnect: false });