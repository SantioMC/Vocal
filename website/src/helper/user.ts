import { writable } from 'svelte/store';

export const user = writable<UserData | null>(null);

export interface UserData {
	username: string;
	uuid: string;
}
