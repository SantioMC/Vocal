import {
	Authorized,
	Body,
	HttpCode,
	HttpError,
	JsonController,
	Post
} from 'routing-controllers';

import * as livekit from '@service/livekit';
import * as minecraft from '@service/minecraft';
import { generateCode } from '@service/minecraft';
import { isHeadless } from '~/helper';
import { intermediateClients } from '~/socket/namespaces/client';

interface VerifyBody {
	username: string;
	uuid: string;
	code: string;
}

interface LinkRequestBody extends Omit<VerifyBody, 'code'> {}

@JsonController()
@Authorized()
export class ManagementController {
	@Post('/verify')
	verify(@Body() body: VerifyBody) {
		if (!isHeadless() && !intermediateClients.has(body.code))
			throw new HttpError(400, 'Invalid code, please try again');

		const token = minecraft.registerPlayer({
			code: body.code,
			uuid: body.uuid,
			username: body.username
		});

		return {
			message: 'Successfully connected to Vocal, please check your browser',
			token
		};
	}

	@Post('/request_link')
	requestLink(@Body() body: LinkRequestBody) {
		const code = generateCode(24);
		minecraft.availableCodes.push(code);

		// Take the base url for the website, we'll build the full url for the client for convenience
		const api_url = process.env.WEBSITE_URL || 'http://localhost:5173';

		// Generate a one-time connection link for the user to connect with
		const path = `/connect/${code}?uuid=${body.uuid}`;
		const link = `${api_url}${path}`;

		minecraft.connectionCodes.set(code, {
			uuid: body.uuid,
			username: body.username,
			code
		});

		// Set a expiry of 10 minutes
		setTimeout(() => {
			minecraft.connectionCodes.delete(code);
		}, 10 * 60e3);

		return {
			link,
			path,
			code
		};
	}
}
