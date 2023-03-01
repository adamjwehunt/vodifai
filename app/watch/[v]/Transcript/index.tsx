import { captionTrack } from 'ytdl-core';
import { TranscriptProvider } from '../TranscriptProvider';
import { VideoDetails } from '../types';
import { getCaptions } from './util';
interface TranscriptWrapperProps {
	captionTracks: captionTrack[];
	videoDetails: VideoDetails;
	children: React.ReactElement[];
}

export const Transcript = async ({
	captionTracks,
	videoDetails,
	children,
}: TranscriptWrapperProps) => {
	const captions = await getCaptions(captionTracks);

	return !captions.length ? null : (
		<TranscriptProvider captions={captions} videoDetails={videoDetails}>
			{children}
		</TranscriptProvider>
	);
};
