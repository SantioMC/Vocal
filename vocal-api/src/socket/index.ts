import { Server } from 'socket.io';
import * as client from './namespaces/client';
import * as server from './namespaces/server';

const io = new Server({
	serveClient: false,
	path: '/ws',
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization']
	}
});

client.use(io.of('/client'));
server.use(io.of('/server'));

export const start = () => {
	const port = parseInt(process.env.WS_PORT ?? '3001');

	io.listen(port);
	console.log(`Socket server listening on port ${port}`);
};
