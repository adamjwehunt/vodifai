import { Top } from './Top';
import { Bottom } from './Bottom';
import { TranscriptControls } from './TranscriptControls';
import { MotionConfig } from 'framer-motion';
import { usePlayerState } from '../PlayerProvider/playerContext';
import { TranscriptProvider } from '../TranscriptProvider';

export const expandDuration = 0.3;

export const Transcript = () => {
	const {
		videoInfo: { captions },
	} = usePlayerState();

	if (!captions.length) {
		return null;
	}

	return (
		<MotionConfig
			transition={{ type: 'ease-in-out', duration: expandDuration }}
		>
			<TranscriptProvider>
				{(captionsRef) => (
					<>
						<Top />
						<Bottom captionsRef={captionsRef} />
						<TranscriptControls />
					</>
				)}
			</TranscriptProvider>
		</MotionConfig>
	);
};
