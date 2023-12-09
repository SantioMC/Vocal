import {
	Get,
	HttpError,
	JsonController,
	Param,
	Post,
	QueryParam
} from 'routing-controllers';

import * as minecraft from '@service/minecraft';
import { generateCode } from '@service/minecraft';

@JsonController('/connect')
export class ConnectionController {
	@Post()
	connect() {
		let code = generateCode();
		minecraft.availableCodes.push(code);

		// If this code expires in a minute, we'll remove it from the available codes
		setTimeout(() => {
			minecraft.availableCodes.splice(
				minecraft.availableCodes.indexOf(code),
				1
			);
		}, 60e3);

		return { code };
	}

	@Post('/:code')
	connectWithCode(
		@Param('code') code: string,
		@QueryParam('uuid') uuid: string
	) {
		if (
			!minecraft.connectionCodes.has(code) ||
			minecraft.connectionCodes.get(code)?.uuid !== uuid
		)
			throw new HttpError(
				404,
				'Invalid link, it might have expired or been used already'
			);

		const player = minecraft.connectionCodes.get(code)!;
		minecraft.registerPlayer(player);

		return {
			player: {
				username: player.username,
				uuid: player.uuid
			}
		};
	}
}
