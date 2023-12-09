import { Player } from '@type/player';
import { Socket } from 'socket.io';

// Reprents a client connected through a websocket
export interface ClientSocket extends Socket {
	code: string;
	player?: Player;
}

// Represents a server connected through a websocket
export interface ServerSocket extends Socket {}
