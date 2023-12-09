import { writable } from 'svelte/store';

const messages = [
	'Getting you setup, hang on tight!',
	'Connecting you to the server...',
	'Launching the ship...',
	"We're about to blast off...",
	'Trying to get you connected...'
];

const message = writable<string | null>();

export const getMessage = async () => {
	return new Promise<string>((resolve) => {
		const newMessage = messages[Math.floor(Math.random() * messages.length)];

		message.update((m) => {
			resolve(m ?? newMessage);
			return m ?? newMessage;
		});
	});
};
