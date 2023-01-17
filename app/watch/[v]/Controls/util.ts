export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function formatDuration(value: number) {
	const minute = Math.floor(value / 60);
	const secondLeft = Math.floor(value - minute * 60);
	return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}
