import { findBestTranscriptUrl, mapYoutubeCaptions } from './youtubeUtil';
import { Caption, CaptionTrack, VideoInfo } from './types';
import { DOMParser } from 'xmldom';
import ytdl from 'ytdl-core';
import { SearchBar } from 'app/SearchBar';
import { PlayerContainer } from './PlayerContainer';
import { Marquee } from './Marquee';
import { Controls } from './Controls';
import { DownloadButton } from './DownloadButton';
import { ShareButton } from './ShareButton';
import { Transcript } from './Transcript';
import { TranscriptControls } from './Transcript/TranscriptControls';
import { Top } from './Transcript/Top';
import styles from './watch.module.scss';
import { MinimizeButton } from './Transcript/MinimizeButton';
import { SearchTranscriptButton } from './Transcript/SearchTranscriptButton';

const baseYoutubeUrl = 'https://www.youtube.com/watch?v=';

async function getYoutubeCaptions(
	captionTracks: CaptionTrack[],
	language = 'en'
): Promise<Caption[]> {
	const transcript = await fetch(findBestTranscriptUrl(captionTracks, language))
		.then((response) => response.text())
		.then((str) => {
			const parser = new DOMParser();
			return parser.parseFromString(str, 'text/xml');
		});

	return mapYoutubeCaptions(transcript);
}

async function getVideoInfo(
	videoId: string,
	language = 'en'
): Promise<VideoInfo> {
	const info = await ytdl.getInfo(videoId);

	const tracks =
		info.player_response.captions?.playerCaptionsTracklistRenderer
			.captionTracks;

	let captions: Caption[] = [];
	if (tracks?.length) {
		captions = await getYoutubeCaptions(tracks, language);
	}

	return {
		id: videoId,
		url: baseYoutubeUrl + videoId,
		videoDetails: {
			author: {
				id: info.videoDetails.author.id,
				name: info.videoDetails.author.name,
			},
			description: info.videoDetails.description,
			title: info.videoDetails.title,
			duration: parseInt(info.videoDetails.lengthSeconds),
		},
		captions,
		formats: info.formats,
	};
}

interface WatchPageProps {
	params: { v: string };
}

export default async function WatchPage({ params: { v } }: WatchPageProps) {
	const videoInfo = await getVideoInfo(v);

	const {
		videoDetails: {
			title: videoTitle,
			author: { name: authorName },
		},
	} = videoInfo;

	return (
		<>
			<SearchBar button />
			<PlayerContainer videoInfo={videoInfo}>
				<div className={styles.playerTray}>
					<div className={styles.details}>
						<div className={styles.detailsText}>
							<Marquee className={styles.title}>{videoTitle}</Marquee>
							<Marquee className={styles.author}>{authorName}</Marquee>
						</div>
					</div>
					<Controls />
					<div className={styles.secondaryControls}>
						<DownloadButton />
						<ShareButton />
					</div>
				</div>
				<Transcript>
					<Top>
						<SearchTranscriptButton />
						<div className={styles.transcriptDetails}>
							<div>{videoTitle}</div>
							<div>{authorName}</div>
						</div>
						<MinimizeButton />
					</Top>
					<TranscriptControls>
						<Controls />
					</TranscriptControls>
				</Transcript>
			</PlayerContainer>
		</>
	);
}
