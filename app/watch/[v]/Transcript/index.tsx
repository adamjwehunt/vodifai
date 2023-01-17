import { useState } from 'react';
import { Top } from './Top';
import { Bottom } from './Bottom';
import { TranscriptControls } from './TranscriptControls';
import { MotionConfig } from 'framer-motion';

interface TranscriptProps {
	playerInfo: any;
}

export default function Transcript({ playerInfo }: TranscriptProps) {
	if (!playerInfo?.captions?.length) {
		return null;
	}

	const { videoDetails, captions } = playerInfo;
	const [isExpanded, setIsExpanded] = useState(false);
	const handleToggleExpand = () => setIsExpanded(!isExpanded);

	return (
		<MotionConfig transition={{ type: 'ease-in-out', duration: 0.35 }}>
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
				onToggleExpand={handleToggleExpand}
			/>
			<TranscriptControls key={'transcriptControls'} isExpanded={isExpanded} />
		</MotionConfig>
	);
}
