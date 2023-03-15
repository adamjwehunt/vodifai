import { getVideoInfo } from 'app/api/ytdl';
import {
	getTranscriptBackground,
	getWatchViewBackground,
} from './util';
import { CSSProperties } from 'react';
import { SearchBar } from 'app/SearchBar';
import { Player } from './Player';
import { PlayerProvider } from './PlayerProvider';
import { Controls } from './Controls';
import { DownloadButton } from './DownloadButton';
import FileDownloadIcon from '@/public/file-download-icon.svg';
import { CopyURLButton } from './CopyURLButton';
import ShareIcon from '@/public/share-icon.svg';
import { TranscriptControls } from './Transcript/TranscriptControls';
import { Top } from './Transcript/Top';
import SearchIcon from '@/public/search-icon.svg';
import { MinimizeButton } from './Transcript/MinimizeButton';
import ChevronDownIcon from '@/public/chevron-back-icon.svg';
import { SearchTranscriptButton } from './Transcript/SearchTranscriptButton';
import { Transcript } from './Transcript';
import { Bottom } from './Transcript/Bottom';
import { RecapButton } from './Transcript/RecapButton';
import RecapIcon from '@/public/ai-icon.svg';
import LoadingSpinner from '@/public/loading-spinner.svg';
import { ExpandButton } from './Transcript/ExpandButton';
import ExpandIcon from '@/public/expand-icon.svg';
import { Captions } from './Transcript/Captions';
import { CopyTranscriptButton } from './Transcript/CopyTranscriptButton';
import ClipboardIcon from '@/public/clipboard-icon.svg';
import classNames from 'classnames';
import styles from './watch.module.scss';
import transcriptStyles from './Transcript/transcript.module.scss';

interface WatchPageProps {
	params: { v: string };
}

export default async function WatchPage({
	params: { v: videoId },
}: WatchPageProps) {
	const { videoInfo, captionTracks } = await getVideoInfo(videoId);

	const {
		videoDetails,
		videoColors: { primaryBackground, secondaryBackground },
	} = videoInfo;
	const {
		title: videoTitle,
		author: { name: authorName },
	} = videoDetails;

	return (
		<div
			className={styles.watchView}
			style={
				{
					background: getWatchViewBackground(primaryBackground),
					'--transcript-color': getTranscriptBackground(secondaryBackground),
				} as CSSProperties
			}
		>
			<SearchBar button />
			<PlayerProvider videoInfo={videoInfo}>
				<Player />
				<div className={styles.playerTray}>
					<div className={styles.details}>
						<div className={styles.detailsText}>
							<span className={styles.title}>{videoTitle}</span>
							<span className={styles.author}>{authorName}</span>
						</div>
					</div>
					<Controls />
					<div className={styles.secondaryControls}>
						<DownloadButton
							ariaLabel={'Open downloads menu'}
							icon={<FileDownloadIcon className={styles.secondaryButtonIcon} />}
							modalTitle={'Downloads'}
						/>
						<CopyURLButton
							ariaLabel={'Copy Video Link'}
							toast={'Link copied to clipboard'}
							icon={<ShareIcon className={styles.secondaryButtonIcon} />}
						/>
					</div>
				</div>
				{/* @ts-expect-error Server Component */}
				<Transcript captionTracks={captionTracks} videoDetails={videoDetails}>
					<Top>
						<SearchTranscriptButton
							ariaLabel={'Search transcript'}
							icon={<SearchIcon className={transcriptStyles.searchIcon} />}
						/>
						<div className={transcriptStyles.transcriptDetails}>
							<div className={transcriptStyles.transcriptTitle}>
								{videoTitle}
							</div>
							<div>{authorName}</div>
						</div>
						<MinimizeButton
							ariaLabel={'Minimize transcript'}
							icon={
								<ChevronDownIcon className={transcriptStyles.chevronDownIcon} />
							}
						/>
					</Top>
					<Bottom>
						<div className={transcriptStyles.transcriptHeader}>
							<div>{'Transcript'}</div>
							<div className={transcriptStyles.bottomButtons}>
								<RecapButton
									text={'Recap'}
									ariaLabel={'Show AI recap'}
									icon={<RecapIcon className={transcriptStyles.recapIcon} />}
									modalTitle={'AI-generated Recap'}
									loadingSpinner={<LoadingSpinner />}
								/>
								<ExpandButton
									ariaLabel={'Expand transcript'}
									icon={<ExpandIcon className={transcriptStyles.expandIcon} />}
								/>
							</div>
						</div>
						<div className={transcriptStyles.captionsWrapper}>
							<Captions />
						</div>
					</Bottom>
					<TranscriptControls>
						<Controls />
						<div
							className={classNames(
								styles.secondaryControls,
								transcriptStyles.transcriptSecondaryControls
							)}
						>
							<CopyTranscriptButton
								ariaLabel={'Copy Transcript Text'}
								toast={'Transcript copied to clipboard'}
								icon={<ClipboardIcon className={styles.secondaryButtonIcon} />}
							/>
						</div>
					</TranscriptControls>
				</Transcript>
			</PlayerProvider>
		</div>
	);
}
