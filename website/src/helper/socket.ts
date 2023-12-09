import { env } from '$env/dynamic/public';
import { io, type Socket } from 'socket.io-client';
import { writable } from 'svelte/store';
import { user } from './user';
import { connectRoom } from './livekit';

export const socket = writable<Socket | null>(null);
export const isConnecting = writable<boolean>(false);

export const connectSocket = async (
	code: string,
	connectionCallback = () => {}
) => {
	return new Promise<void>((resolve, reject) => {
		const test = io(env.PUBLIC_SOCKET_URL + '/client', {
			path: '/ws',
			auth: { code },
			transports: ['websocket']
		});

		test.once('connect_error', (err) => {
			console.log('Socket connect error: ', err);
			reject(err);
		});

		test.once('connect', () => {
			console.log('Socket connected');
			resolve();
		});

		socket.set(test);

		test?.once('connected', (data) => {
			console.log(data);
			isConnecting.set(true);
			user.set(data);

			console.log('Successfully verified user, connecting to voice chat...');

			// Connect to voice chat
			connectRoom(data.token).then(connectionCallback);
		});
	});
};
