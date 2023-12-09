import { connected } from '@service/minecraft';
import { Player } from '@type/player';
import {
	AccessToken,
	RoomServiceClient,
	TrackSource
} from 'livekit-server-sdk';

let client: RoomServiceClient | null = null;

export const getRoomService = (): RoomServiceClient => {
	if (client === null)
		client = new RoomServiceClient(
			process.env.LIVEKIT_URL!,
			process.env.LK_API_KEY,
			process.env.LK_API_SECRET
		);

	return client;
};

export const createToken = (room: string, username: string) => {
	const at = new AccessToken(
		process.env.LK_API_KEY,
		process.env.LK_API_SECRET,
		{
			identity: username
		}
	);

	at.addGrant({
		room,
		roomJoin: true,
		canPublish: true,
		hidden: true,
		canSubscribe: false,
		canPublishSources: [TrackSource.MICROPHONE]
	});

	return at.toJwt();
};

export interface EntityLocation {
	player: string;
	nearby: {
		player: string;
		relPos: [number, number, number];
	}[];
	server: string;
}

export const handleData = async (location: EntityLocation) => {
	const player = connected.find((p) => p.uuid === location.player);
	if (!player) return;

	if (player.nearby.toString() !== location.nearby.toString()) {
		const uuids = location.nearby.map((n) => n.player);
		const toSubscribe = uuids.filter((n) => !player.nearby.includes(n));
		const toUnsubscribe = player.nearby.filter((n) => !uuids.includes(n));

		for (const entity of toSubscribe) {
			updateSubscription(player, entity, true);
		}

		for (const entity of toUnsubscribe) {
			updateSubscription(player, entity, false);
		}
	}
};

const updateSubscription = async (
	player: Player,
	entity: string,
	subscribe: boolean
) => {
	const nearby = connected.find((p) => p.uuid === entity);
	if (!nearby) return;

	const participant = await getRoomService().getParticipant(
		'global',
		nearby.code
	);
	if (!participant) return;

	getRoomService().updateSubscriptions(
		'global',
		player.code,
		participant.tracks.map((t) => t.sid),
		subscribe
	);
};
