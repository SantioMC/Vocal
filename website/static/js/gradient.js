// https://stackoverflow.com/a/44134328
function hslTohexex(h, s, l) {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
function hexTohexsl(hex) {
	let r = 0,
		g = 0,
		b = 0;
	if (hex.length == 4) {
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];
	} else if (hex.length == 7) {
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	}

	r /= 255;
	g /= 255;
	b /= 255;
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (delta == 0) h = 0;
	else if (cmax == r) h = ((g - b) / delta) % 6;
	else if (cmax == g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0) h += 360;

	l = (cmax + cmin) / 2;
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return [h, s, l];
}

const generateGradientColors = () => {
	const rotation = Math.floor(Math.random() * 360);
	const colorCount = Math.floor(Math.random() * 3) + 2;
	const colors = [];

	let lasthexue = -1;
	for (let i = 0; i < colorCount; i++) {
		let hue;
		if (lasthexue === -1) {
			hue = Math.floor(Math.random() * 300);
		} else {
			hue = Math.floor(Math.random() * 80) - 40 + lasthexue;
		}
		lasthexue = hue;

		const saturation = Math.floor(Math.random() * 40) + 20;
		const lightness = Math.floor(Math.random() * 20) + 10;
		const color = hslTohexex(hue, saturation, lightness);
		colors.push(color);
	}

	return [rotation, colors];
};

const colorsToGradient = (rotation, colors) => {
	return `linear-gradient(${rotation}deg, ${colors.join(', ')})`;
};

const rotateGradient = (gradient) => {
	// Slightly change the colors
	let colors = gradient[1];
	for (let i = 0; i < colors.length; i++) {
		const hex = colors[i];
		const hsl = hexTohexsl(hex);
		const hue = hsl[0] + Math.floor(Math.random() * 3) * direction;
		colors[i] = hslTohexex(hue, hsl[1], hsl[2]);

		if (Math.floor(Math.random() * 100) < 1) {
			direction = -direction;
		}
	}

	if (Math.floor(Math.random() * 100) < 3) {
		gradient[0] += Math.floor(Math.random() * 2) * direction;
	}

	return [gradient[0], colors];
};

let currentGradient = generateGradientColors();
let direction = 1;

document.body.style.background = colorsToGradient(
	currentGradient[0],
	currentGradient[1]
);

// setInterval(() => {
//   currentGradient = rotateGradient(currentGradient);
//   document.body.style.background = colorsToGradient(
//     currentGradient[0],
//     currentGradient[1]
//   );
// }, 50);
