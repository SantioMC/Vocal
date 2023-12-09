import { Namespace } from 'socket.io';
import * as minecraft from '@service/minecraft';
import { ClientSocket } from '@type/socket';

// code: socket - Not connected to the client yet
export const intermediateClients: Map<string, ClientSocket> = new Map();

// uuid: socket - Connected to the client
export const clients = new Map<string, ClientSocket>();

export const use = (io: Namespace) => {
	io.use((connection, next) => {
		const code = connection.handshake.auth.code;
		console.log('Authenticating socket: ', code);

		if (!code || !minecraft.availableCodes.includes(code)) {
			console.log('Invalid code');
			return next(new Error('Invalid code'));
		}

		const socket = <ClientSocket>connection;
		socket.code = code;
		socket.join(`code:${code}`);

		minecraft.availableCodes.splice(minecraft.availableCodes.indexOf(code), 1);
		next();
	});

	io.on('connection', (connection) => {
		const socket = <ClientSocket>connection;
		intermediateClients.set(socket.code, socket);

		socket.on('disconnect', () => {
			intermediateClients.delete(socket.code);
			if (socket.player) clients.delete(socket.player.uuid);

			minecraft.connected.splice(
				minecraft.connected.findIndex((player) => player.code === socket.code),
				1
			);
		});
	});
};
