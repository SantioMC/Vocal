import {
	ExpressErrorMiddlewareInterface,
	Middleware
} from 'routing-controllers';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
	error(error: any, _request: any, response: any, _next: (err: any) => any) {
		return response.status(error.httpCode ?? 500).json({
			error: true,
			code: error.httpCode ?? 500,
			message: error.message ?? 'Internal server error'
		});
	}
}
