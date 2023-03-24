'use client';

import { ReactElement, useRef } from 'react';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { Modal, ModalRef } from '../../../components/Modal';
import { DownloadItems } from './DownloadItems';
import { cleanAudioQualityString, formatBytes, getUniqueFormats } from './util';
import { Download } from 'app/types';
import { videoFormat } from 'ytdl-core';
import styles from '../watch.module.scss';

export interface DownloadButtonProps {
	ariaLabel: string;
	children: ReactElement;
	modalTitle: string;
}

export const DownloadButton = ({
	ariaLabel,
	children,
	modalTitle,
}: DownloadButtonProps) => {
	const {
		videoInfo: { formats },
	} = usePlayerState();

	const modalRef = useRef<ModalRef>(null);
	const handleShowDownloads = () => {
		modalRef.current?.open();
	};

	const {
		videoFormats,
		audioFormats,
	}: { videoFormats: Download[]; audioFormats: Download[] } = formats.reduce(
		(
			acc: { videoFormats: Download[]; audioFormats: Download[] },
			format: videoFormat
		) => {
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
				{children}
			</button>
			{!uniqueVideoFormats.length && !uniqueAudioFormats.length ? null : (
				<Modal ref={modalRef} title={modalTitle}>
					<div className={styles.downloadsContainer}>
						{!uniqueVideoFormats.length ? null : (
							<DownloadItems header={'Video'} formats={uniqueVideoFormats} />
						)}
						{!uniqueAudioFormats.length ? null : (
							<DownloadItems header={'Audio'} formats={uniqueAudioFormats} />
						)}
					</div>
				</Modal>
			)}
		</>
	);
};
