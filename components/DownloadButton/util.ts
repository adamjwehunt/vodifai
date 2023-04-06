import { Download } from '@/app/types';

export function getUniqueFormats(formats: Download[]) {
	const uniqueFormats = new Set<string>();

	const qualityScores: { [key: string]: number } = {
		'144p': 0,
		'240p': 1,
		'360p': 2,
		'480p': 3,
		'720p': 4,
		'1080p': 5,
		'1440p': 6,
		'2160p': 7,
		'2880p': 8,
		'3072p': 9,
		'4320p': 10,
	};

	return formats
		.sort((a, b) => {
			const aScore = qualityScores[a.format.qualityLabel] || 0;
			const bScore = qualityScores[b.format.qualityLabel] || 0;
			return bScore - aScore;
		})
		.filter(({ format }) => {
			const key = `${format.container} ${format.qualityLabel}`;
			if (uniqueFormats.has(key)) {
				return false;
			} else {
				uniqueFormats.add(key);
				return true;
			}
		});
}

export function cleanAudioQualityString(audioQuality: string | undefined) {
	if (!audioQuality) {
		return '';
	}
	return audioQuality.replace('AUDIO_QUALITY_', '').toLowerCase();
}

export function formatBytes(bytes: string): string {
	const numBytes = parseInt(bytes);
	if (numBytes === 0) {
		return '0 Bytes';
	}

	const k = 1024,
		sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
		i = Math.floor(Math.log(numBytes) / Math.log(k));

	if (i === 0) {
		return numBytes + ' ' + sizes[i];
	}

	let val: number;

	if (i === 1) {
		val = Math.floor(numBytes / k);
	} else {
		val = parseFloat((numBytes / Math.pow(k, i)).toFixed(2));
	}

	if (i === 1) {
		return val + ' ' + sizes[i];
	} else if (val < 10) {
		return val.toFixed(1) + ' ' + sizes[i];
	} else {
		return val.toFixed(0) + ' ' + sizes[i];
	}
}
