import { env } from 'process';
import { io } from 'socket.io-client';

const URL: string = env.WS_SERVER_URL || 'http://localhost:3000';

export const socket = io(URL, { autoConnect: false });