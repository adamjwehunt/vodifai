import { CSSProperties } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { WatchPageContainer } from 'components/WatchPageContainer';
import { Player } from 'components/Player';
import fileDownloadIconUrl from '@/public/file-download-icon.svg?url';
import shareIconUrl from '@/public/share-icon.svg?url';
import SearchIcon from '@/public/search-icon.svg';
import ChevronDownIcon from '@/public/chevron-back-icon.svg';
import recapIconUrl from '@/public/ai-icon.svg?url';
import LoadingSpinner from '@/public/loading-spinner.svg';
import expandIconUrl from '@/public/expand-icon.svg?url';
import ClipboardIcon from '@/public/clipboard-icon.svg';
import { getVideoInfo } from 'lib/ytdl';
import { DownloadButton } from 'components/DownloadButton';
import { Controls } from 'components/Controls';
import { CopyURLButton } from 'components/CopyURLButton';
import { PlayerProvider } from 'components/PlayerProvider';
import { Transcript } from 'components/Transcript';
import { Bottom } from 'components/Transcript/Bottom';
import { Captions } from 'components/Transcript/Captions';
import { CopyTranscriptButton } from 'components/Transcript/CopyTranscriptButton';
import { ExpandButton } from 'components/Transcript/ExpandButton';
import { MinimizeButton } from 'components/Transcript/MinimizeButton';
import { RecapButton } from 'components/Transcript/RecapButton';
import { SearchTranscriptButton } from 'components/Transcript/SearchTranscriptButton';
import { Top } from 'components/Transcript/Top';
import { TranscriptControls } from 'components/Transcript/TranscriptControls';
import { getWatchViewBackground, getTranscriptBackground } from 'utils';
import styles from './watch.module.scss';
import transcriptStyles from 'components/Transcript/transcript.module.scss';

interface WatchPageProps {
	params: { v: string };
}

export default async function WatchPage({
	params: { v: videoId },
}: WatchPageProps) {
	const { videoInfo, captionTracks } = await getVideoInfo(videoId);

	if (!videoInfo) {
		return (
			<div className={styles.videoNotFound}>
				<h3>{`Video not found.`}</h3>
			</div>
		);
	}

	const {
		videoDetails,
		videoColors: { primaryBackground, secondaryBackground },
	} = videoInfo;
	const {
		title: videoTitle,
		author: { name: authorName },
	} = videoDetails;

	return (
		<WatchPageContainer
			background={getWatchViewBackground(primaryBackground)}
			style={
				{
					'--transcript-color': getTranscriptBackground(secondaryBackground),
				} as CSSProperties
			}
		>
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
				</div>
				<div className={styles.secondaryControls}>
					<DownloadButton
						ariaLabel={'Open downloads menu'}
						modalTitle={'Downloads'}
					>
						<Image alt={''} src={fileDownloadIconUrl} />
					</DownloadButton>
					<CopyURLButton
						ariaLabel={'Copy Video Link'}
						toast={'Link copied to clipboard'}
						icon={
							<Image
								className={styles.copyUrlIcon}
								alt={''}
								src={shareIconUrl}
							/>
						}
					/>
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
									ariaLabel={'Show AI recap'}
									modalTitle={'AI-generated Recap'}
									loadingSpinner={<LoadingSpinner />}
								>
									<Image alt={''} src={recapIconUrl} />
									{'Recap'}
								</RecapButton>
								<ExpandButton ariaLabel={'Expand transcript'}>
									<Image alt={''} src={expandIconUrl} />
								</ExpandButton>
							</div>
						</div>
						<Captions />
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
		</WatchPageContainer>
	);
}
