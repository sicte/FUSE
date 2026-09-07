import { urlBase } from '../../api/APIs';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io(urlBase, {
    withCredentials: true,
});

export default socket;