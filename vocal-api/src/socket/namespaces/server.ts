import { Namespace } from 'socket.io';
import { ServerSocket } from '@type/socket';
import { parseJson } from '~/helper';
import * as livekit from '@service/livekit';
import { EntityLocation } from '@service/livekit';

export const servers: ServerSocket[] = [];

export const use = (io: Namespace) => {
	io.use((connection, next) => {
		const appToken = process.env.APP_TOKEN;
		const token = connection.handshake.auth.token;

		if (appToken !== undefined && (!token || appToken !== token)) {
			return next(new Error('Invalid token provided'));
		}

		const socket = <ServerSocket>connection;
		socket.join('servers');

		next();
	});

	io.on('connection', (connection) => {
		const socket = <ServerSocket>connection;
		servers.push(socket);
		console.log(`[${socket.id}] Server connected`);

		socket.on('disconnect', () => {
			servers.splice(servers.indexOf(socket), 1);
			console.log(`[${socket.id}] Server disconnected`);
		});

		socket.on('movement', (data) => {
			const json = parseJson(data);
			if (!json)
				return console.log(`[${socket.id}] Failed to parse movement data`);

			if (!isEntityLocation(json))
				return console.log(`[${socket.id}] Malformed movement data`);

			livekit.handleData(json);
		});
	});
};

const isEntityLocation = (data: any): data is EntityLocation => {
	const { player, nearby, server } = data;
	if (!player || !nearby || !server) return false;

	for (const entity of nearby) {
		if (!entity.player || !entity.relPos) return false;

		if (!Array.isArray(entity.relPos) || entity.relPos.length !== 3)
			return false;
	}

	return data;
};
