const validQueryDomains = new Set([
	'youtube.com',
	'www.youtube.com',
	'm.youtube.com',
	'music.youtube.com',
	'gaming.youtube.com',
]);

const validPathDomains =
	/^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;

export const getYoutubeVideoIdFromUrl = (url: string | undefined) => {
	if (!url) {
		return;
	}

	let id: string | null;
	let parsed: URL;

	try {
		parsed = new URL(url.trim());
		id = parsed.searchParams.get('v');
	} catch (error) {
		return;
	}

	if (validPathDomains.test(url.trim()) && !id) {
		const paths = parsed.pathname.split('/');
		id = parsed.host === 'youtu.be' ? paths[1] : paths[2];
	} else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
		console.warn('Not a YouTube domain');
		return;
	}

	if (!id) {
		console.warn(`No video id found: "${url}"`);
		return;
	}

	id = id.substring(0, 11);

	if (!validateID(id)) {
		throw TypeError(
			`Video id (${id}) does not match expected ` +
				`format (${idRegex.toString()})`
		);
	}

	return id;
};

const idRegex = /^[a-zA-Z0-9-_]{11}$/;

const validateID = (id: string) => idRegex.test(id.trim());
