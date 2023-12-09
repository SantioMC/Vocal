import { writable } from 'svelte/store';
import {
	Room,
	RemoteTrack,
	RemoteTrackPublication,
	RemoteParticipant,
	RoomEvent
} from 'livekit-client';
import { PUBLIC_LIVEKIT_URL } from '$env/static/public';

export const room = writable<Room | null>(null);

export const connectRoom = async (token: TokenData) => {
	const connection = new Room();
	await connection.connect(PUBLIC_LIVEKIT_URL, token.token, {
		autoSubscribe: false
	});

	console.log('connected to room', connection.name);
	await connection.localParticipant.setMicrophoneEnabled(true);

	connection.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
};

function handleTrackSubscribed(
	track: RemoteTrack,
	_publication: RemoteTrackPublication,
	_participant: RemoteParticipant
) {
	const context = attach(track);
	createPanner(context).connect(context.destination);
}

const attach = (track: RemoteTrack): AudioContext => {
	const context = new AudioContext();
	const element = document.createElement('audio');

	const source = context.createMediaElementSource(element);
	source.connect(context.destination);

	track.attach(element);
	document.body.appendChild(element);

	return context;
};

const createPanner = (context: AudioContext) => {
	const panner = context.createPanner();

	panner.coneOuterAngle = 360;
	panner.coneInnerAngle = 360;
	panner.coneOuterGain = 1;

	panner.positionX.setValueAtTime(Number.MIN_SAFE_INTEGER, 0);
	panner.positionY.setValueAtTime(Number.MIN_SAFE_INTEGER, 0);
	panner.positionZ.setValueAtTime(Number.MIN_SAFE_INTEGER, 0);

	panner.distanceModel = 'exponential';
	panner.refDistance = 100;
	panner.maxDistance = 500;
	panner.rolloffFactor = 2;

	panner.positionX.setTargetAtTime(6, 0, 0.02);
	panner.positionZ.setTargetAtTime(3, 0, 0.02);

	return panner;
};

export interface TokenData {
	token: string;
	room: string;
	identity: string;
}
