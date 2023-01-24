import { VideoInfo } from './types';
import ytdl, { captionTrack } from 'ytdl-core';
import { SearchBar } from 'app/SearchBar';
import { PlayerContainer } from './PlayerContainer';
import { Controls } from './Controls';
import { DownloadButton } from './DownloadButton';
import { ShareButton } from './ShareButton';
import { TranscriptControls } from './Transcript/TranscriptControls';
import { Top } from './Transcript/Top';
import { MinimizeButton } from './Transcript/MinimizeButton';
import { SearchTranscriptButton } from './Transcript/SearchTranscriptButton';
import { Transcript } from './Transcript';
import styles from './watch.module.scss';

const baseYoutubeUrl = 'https://www.youtube.com/watch?v=';

async function getVideoInfo(
	videoId: string
): Promise<{ videoInfo: VideoInfo; captionTracks: captionTrack[] }> {
	const info = await ytdl.getInfo(videoId);

	return {
		videoInfo: {
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

			formats: info.formats,
		},
		captionTracks:
			info.player_response.captions?.playerCaptionsTracklistRenderer
				.captionTracks || [],
	};
}

interface WatchPageProps {
	params: { v: string };
}

export default async function WatchPage({
	params: { v: videoId },
}: WatchPageProps) {
	const { videoInfo, captionTracks } = await getVideoInfo(videoId);

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
							<span className={styles.title}>{videoTitle}</span>
							<span className={styles.author}>{authorName}</span>
						</div>
					</div>
					<Controls />
					<div className={styles.secondaryControls}>
						<DownloadButton />
						<ShareButton />
					</div>
				</div>
				{/* @ts-expect-error Server Component */}
				<Transcript captionTracks={captionTracks}>
					<Top>
						<SearchTranscriptButton />
						<div className={styles.transcriptDetails}>
							<div className={styles.transcriptTitle}>{videoTitle}</div>
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
