import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';

const cleanMongo = (data: any) => {
	if (!data) return data;

	if (Array.isArray(data)) {
		for (const item of data) cleanMongo(item);
		return data;
	}

	if (data.__v) delete data.__v;
	if (data._id) {
		data.id = data._id;
		delete data._id;
	}

	return data;
};

const isJson = (data: any): any | null => {
	if (typeof data === 'object') return data;
	try {
		JSON.parse(data);
		return data;
	} catch (e) {
		return null;
	}
};

@Interceptor({ priority: 1 })
export class ResponseFormatInterceptor implements InterceptorInterface {
	intercept(action: Action, content: any) {
		const json = isJson(content);
		if (json === null) return content;

		const data = cleanMongo(json);

		if (Array.isArray(data)) {
			return action.response.json({
				error: false,
				message: 'OK',
				data
			});
		} else {
			return action.response.json({
				error: false,
				message: 'OK',
				...data
			});
		}
	}
}
