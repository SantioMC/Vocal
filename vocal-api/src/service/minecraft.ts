import { Player } from '@type/player';
import * as livekit from '@service/livekit';
import { isHeadless } from '~/helper';
import { clients, intermediateClients } from '~/socket/namespaces/client';

export const connected: Player[] = [];
export const availableCodes: string[] = [];
export const connectionCodes: Map<string, Player> = new Map();

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const generateCode = (length: number = 6) => {
	const randomChar = () =>
		ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

	let code = 'v';

	for (let i = 1; i < length; i++) {
		code += randomChar();
	}

	if (availableCodes.includes(code)) {
		return generateCode();
	}

	return code;
};

export const registerPlayer = (player: Player): Token => {
	connected.push(player);

	const roomToken = livekit.createToken('global', player.code);

	const token: Token = {
		token: roomToken,
		room: 'global',
		identity: player.code
	};

	connectionCodes.delete(player.code);

	if (!isHeadless()) {
		// Move them to the clients map
		const client = intermediateClients.get(player.code)!;
		intermediateClients.delete(player.code);

		// Notify client that they're connected
		clients.set(player.uuid, client);
		client.emit('connected', {
			username: player.username,
			uuid: player.uuid,
			token
		});
	}

	return token;
};

export interface Token {
	token: string;
	room: string;
	identity: string;
}
