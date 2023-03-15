'use client';

import { useRef } from 'react';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { Download } from '../types';
import { WatchModal, WatchModalRef } from '../WatchModal';
import styles from '../watch.module.scss';

export interface DownloadButtonProps {
	ariaLabel: string;
	icon: React.ReactNode;
	modalTitle: string;
}

export const DownloadButton = ({
	ariaLabel,
	icon,
	modalTitle,
}: DownloadButtonProps) => {
	const {
		videoInfo: { formats },
	} = usePlayerState();

	const modalRef = useRef<WatchModalRef>(null);
	const handleShowDownloads = () => {
		modalRef.current?.open();
	};

	const {
		videoFormats,
		audioFormats,
	}: { videoFormats: Download[]; audioFormats: Download[] } = formats.reduce(
		(acc, format) => {
			const { hasVideo, hasAudio } = format;
			const type = hasVideo ? 'videoFormats' : hasAudio ? 'audioFormats' : '';
			if (!type) return acc;

			const download: Download = {
				format: {
					itag: format.itag,
					container: format.container,
					qualityLabel: hasVideo
						? format.qualityLabel
						: cleanAudioQualityString(format.audioQuality),
					bitrate: hasVideo ? format.bitrate ?? 0 : format.audioBitrate ?? 0,
					type: hasVideo ? format.codecs : format.audioCodec,
					contentLength: formatBytes(format.contentLength),
				},
				url: format.url,
			};

			return { ...acc, [type]: [...acc[type], download] };
		},
		{ videoFormats: [], audioFormats: [] }
	);

	const uniqueVideoFormats = getUniqueFormats(videoFormats);
	const uniqueAudioFormats = getUniqueFormats(audioFormats);

	return (
		<>
			<button aria-label={ariaLabel} onClick={handleShowDownloads}>
				{icon}
			</button>
			{!uniqueVideoFormats.length && !uniqueAudioFormats.length ? null : (
				<WatchModal ref={modalRef} title={modalTitle}>
					<div className={styles.downloadsContainer}>
						{!uniqueVideoFormats.length ? null : (
							<DownloadItems header={'Video'} formats={uniqueVideoFormats} />
						)}
						{!uniqueAudioFormats.length ? null : (
							<DownloadItems header={'Audio'} formats={uniqueAudioFormats} />
						)}
					</div>
				</WatchModal>
			)}
		</>
	);
};

interface DownloadItemsProps {
	formats: Download[];
	header: string;
}

const DownloadItems = ({ formats, header }: DownloadItemsProps) => {
	const formatGroups: { [key: string]: Download[] } = {};
	formats.forEach(({ format, url }) => {
		const key = format.qualityLabel;
		if (formatGroups[key]) {
			formatGroups[key].push({ format, url });
		} else {
			formatGroups[key] = [{ format, url }];
		}
	});

	return (
		<>
			<h3>{header}</h3>
			{Object.keys(formatGroups).map((qualityLabel) => (
				<div key={qualityLabel} className={styles.formatGroup}>
					<div className={styles.qualityLabel}>{qualityLabel}</div>
					<div className={styles.formatLinks}>
						{formatGroups[qualityLabel].map(({ format, url }) => (
							<a href={url} target="_blank" download key={format.itag}>
								<div>{format.container}</div>
								<div>{'-'}</div>
								<div>{format.contentLength}</div>
							</a>
						))}
					</div>
				</div>
			))}
		</>
	);
};

function getUniqueFormats(formats: Download[]) {
	const uniqueFormats = new Set<string>();

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

function cleanAudioQualityString(audioQuality: string | undefined) {
	if (!audioQuality) {
		return '';
	}
	return audioQuality.replace('AUDIO_QUALITY_', '').toLowerCase();
}

function formatBytes(bytes: string): string {
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
