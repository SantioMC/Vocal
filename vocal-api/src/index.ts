import { Request } from 'express';
import { join } from 'path';
import * as socket from './socket';
import 'reflect-metadata';

require('dotenv').config({
	path: '../.env'
});

import { createExpressServer } from 'routing-controllers';

const token = process.env.APP_TOKEN;
const port = process.env.API_PORT ?? 3000;

const app = createExpressServer({
	controllers: [join(__dirname + '/controllers/*.ts')],
	interceptors: [join(__dirname + '/interceptors/*.ts')],
	middlewares: [join(__dirname + '/middleware/*.ts')],

	defaultErrorHandler: false,
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization']
	},

	authorizationChecker: (action, _) => {
		const request = action.request as Request;
		if (token === undefined || token.trim() == '') return true;

		return (
			request.headers['authorization'] === `Bearer ${token}` ||
			request.query['api_key'] === token
		);
	}
}).listen(port);

app.once('listening', () => {
	console.log(`Server listening on port ${port}`);
	socket.start();
});
