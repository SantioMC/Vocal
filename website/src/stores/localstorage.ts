// Similar to a svelte store, however stores the data in localStorage, used for small persistent data

export class LocalStorageStore<T> {
	private _key: string;
	private _value: T;
	private _subscribers: ((value: T) => void)[] = [];

	constructor(key: string, initialValue: T) {
		this._key = key;
		this._value = initialValue;

		// load from localstorage
		const data = localStorage.getItem(key);
		if (data) {
			try {
				this._value = JSON.parse(data);
			} catch (err) {
				console.error('failed to parse localstorage', err);
			}
		}
	}

	get value(): T {
		return this._value!;
	}

	set value(value: T) {
		this._value = value;
		localStorage.setItem(this._key, JSON.stringify(value));
		this._subscribers.forEach((fn) => fn(value));
	}

	update(fn: (value: T) => T) {
		const newValue = fn(this._value);
		this.value = newValue;
	}

	subscribe(fn: (value: T) => void) {
		this._subscribers.push(fn);
		return () => {
			this._subscribers = this._subscribers.filter((f) => f !== fn);
		};
	}
}

export const localstorage = <T>(key: string, initialValue: T) => {
	return new LocalStorageStore(key, initialValue);
};
