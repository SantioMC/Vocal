import { writable } from 'svelte/store';
import {
	Room,
	RemoteTrack,
	RemoteTrackPublication,
	RemoteParticipant,
	RoomEvent,
	LocalAudioTrack,
	LocalTrackPublication
} from 'livekit-client';
import { PUBLIC_LIVEKIT_URL } from '$env/static/public';

export const room = writable<Room | null>(null);
export const localTrack = writable<LocalAudioTrack | null>(null);

export const publishMicrophone = async (
	connection: Room,
	microphone: string = 'default'
) => {
	const track = await connection.localParticipant.setMicrophoneEnabled(true, {
		echoCancellation: true,
		autoGainControl: true,
		noiseSuppression: true,
		deviceId: microphone === 'default' ? undefined : microphone
	});

	if (track && track.audioTrack) localTrack.set(track.audioTrack);
};

export const connectRoom = async (token: TokenData) => {
	const connection = new Room({
		audioCaptureDefaults: {
			echoCancellation: true,
			autoGainControl: true,
			noiseSuppression: true
		}
	});
	room.set(connection);

	await connection.connect(PUBLIC_LIVEKIT_URL, token.token, {
		autoSubscribe: true
	});

	console.log('connected to room', connection.name);
	await publishMicrophone(connection);

	connection.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
};

export const getMicrophones = async (): Promise<AudioInput[]> => {
	await navigator.mediaDevices.getUserMedia({ audio: true });
	let devices = await navigator.mediaDevices.enumerateDevices();
	devices = Array.from(devices);

	return devices
		.filter((d) => d.kind === 'audioinput')
		.map((d) => {
			let name = d.deviceId;

			if (d.label.trim() === '') {
				name = d.deviceId;
			} else if (d.label.length > 40) {
				name = d.label.substring(0, 37) + '...';
			} else {
				name = d.label;
			}

			return {
				details: d,
				name,
				monitor: d.label.startsWith('Monitor of')
			};
		}) as AudioInput[];
};

export const setMicrophone = async (connection: Room, deviceId: string) => {
	await publishMicrophone(connection, deviceId);
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

export interface AudioInput {
	details: MediaDeviceInfo;
	name: string;
	monitor: boolean;
}
