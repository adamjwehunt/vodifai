import { captionTrack } from '@distube/ytdl-core';
import { TranscriptProvider } from '../TranscriptProvider';
import { VideoDetails } from '@/app/types';
import { getCaptions } from './util';

interface TranscriptWrapperProps {
	captionTracks?: captionTrack[];
	videoDetails: VideoDetails;
	children: React.ReactElement[];
}

export const Transcript = async ({
	captionTracks,
	videoDetails,
	children,
}: TranscriptWrapperProps) => {
	if (!captionTracks) {
		return;
	}
	const captions = await getCaptions(captionTracks);

	return !captions.length ? null : (
		<TranscriptProvider captions={captions} videoDetails={videoDetails}>
			{children}
		</TranscriptProvider>
	);
};
