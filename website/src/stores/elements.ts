import { localstorage, type LocalStorageStore } from './localstorage';

export class ElementStore {
	private _elements: StoredElement[];
	private _subscribers: ((value: any) => void)[] = [];

	constructor() {
		this._elements = [];
	}

	get elements(): HTMLElement[] {
		return this._elements.map((e) => e.element);
	}

	addElement(element: HTMLElement) {
		const event = (e: Event) => {
			if (e.target == null) return;

			const target = e.target as HTMLElement;
			this.setValue(target, this.getValue(target));
		};

		this._elements.push({
			element,
			event
		});

		element.addEventListener('change', event);
	}

	removeElement(element: HTMLElement) {
		const stored = this._elements.find((e) => e.element === element);
		if (!stored) return;

		const index = this._elements.indexOf(stored);
		this._elements.splice(index, 1);

		element.removeEventListener('change', stored.event);
	}

	getValue(element: HTMLElement): any {
		if (element instanceof HTMLInputElement) {
			if (element.type === 'checkbox') {
				return element.checked;
			} else return element.value;
		} else if (element instanceof HTMLSelectElement) {
			return element.value;
		} else {
			throw new Error(
				"Element is not supported, couldn't get value for type " +
					element.tagName
			);
		}
	}

	setValue(element: HTMLElement, value: any) {
		if (element instanceof HTMLInputElement) {
			if (element.type === 'checkbox') {
				element.checked = value;
			} else element.value = value;
		} else if (element instanceof HTMLSelectElement) {
			setTimeout(() => {
				const children = Array.from(element.children);
				const option = children.find(
					(o) => (o as HTMLOptionElement).value === value
				);

				option?.setAttribute('selected', 'selected');
			}, 250);
		} else {
			throw new Error(
				"Element is not supported, couldn't set value for type " +
					element.tagName
			);
		}

		this._subscribers.forEach((fn) => fn(this.json));
	}

	get json(): any {
		const json: {
			[key: string]: any;
		} = {};

		this._elements.forEach((stored) => {
			json[stored.element.id] = this.getValue(stored.element);
		});

		return json;
	}

	load(json: any) {
		for (const [key, value] of Object.entries(json)) {
			const element = document.getElementById(key);
			if (element) this.setValue(element, value);
		}
	}

	subscribe(fn: (value: any) => void) {
		this._subscribers.push(fn);
		return () => {
			this._subscribers = this._subscribers.filter((f) => f !== fn);
		};
	}

	storable(key: string): LocalStorageStore<any> {
		const store = localstorage(key, this.json);

		// If we have settings, let's load them
		this.load(store.value);

		this.subscribe((value) => {
			store.value = value;
		});

		return store;
	}
}

export const elementstore = (ids: string[] | undefined = undefined) => {
	const store = new ElementStore();

	ids?.forEach((id) => {
		const element = document.getElementById(id);
		if (element) store.addElement(element);
	});

	return store;
};

interface StoredElement {
	element: HTMLElement;
	event: (e: Event) => void;
}
