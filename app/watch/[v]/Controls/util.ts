export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function formatPlayerTime(value: number) {
	const minute = Math.floor(value / 60);
	const secondsLeft = Math.floor(value - minute * 60);
	return `${minute}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
}
