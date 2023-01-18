import { useRef, useState } from 'react';
import { Top } from './Top';
import { Bottom } from './Bottom';
import { TranscriptControls } from './TranscriptControls';
import { MotionConfig } from 'framer-motion';

export const expandDuration = 0.3;

interface TranscriptProps {
	playerInfo: any;
}

export default function Transcript({ playerInfo }: TranscriptProps) {
	if (!playerInfo?.captions?.length) {
		return null;
	}

	const { videoDetails, captions } = playerInfo;
	const [isExpanded, setIsExpanded] = useState(false);
	const captionsRef = useRef<HTMLDivElement | null>(null);

	const handleToggleExpand = () => {
		setIsExpanded(!isExpanded);
		if (captionsRef.current) {
			captionsRef.current.centerActiveCaption();
		}
	};

	return (
		<MotionConfig
			transition={{ type: 'ease-in-out', duration: expandDuration }}
		>
			<Top
				key={'top'}
				title={videoDetails?.title ?? ''}
				artist={videoDetails?.author?.name ?? ''}
				isExpanded={isExpanded}
				onToggleExpand={handleToggleExpand}
			/>
			<Bottom
				captions={captions}
				isExpanded={isExpanded}
				captionsRef={captionsRef}
				onToggleExpand={handleToggleExpand}
			/>
			<TranscriptControls key={'transcriptControls'} isExpanded={isExpanded} />
		</MotionConfig>
	);
}
