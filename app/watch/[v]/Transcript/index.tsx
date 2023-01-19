import { ElementRef, useRef, useState } from 'react';
import { Top } from './Top';
import { Bottom } from './Bottom';
import { TranscriptControls } from './TranscriptControls';
import { MotionConfig } from 'framer-motion';
import { VideoInfo } from '../types';
import { Captions } from './Captions';

export const expandDuration = 0.3;

interface TranscriptProps {
	videoInfo: VideoInfo;
}

export default function Transcript({ videoInfo }: TranscriptProps) {
	if (!videoInfo?.captions?.length) {
		return null;
	}

	const { videoDetails, captions } = videoInfo;
	const [isExpanded, setIsExpanded] = useState(false);
	const captionsRef = useRef<ElementRef<typeof Captions>>(null);

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
