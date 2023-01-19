import { ElementRef, useRef, useState } from 'react';
import { Top } from './Top';
import { Bottom } from './Bottom';
import { TranscriptControls } from './TranscriptControls';
import { MotionConfig } from 'framer-motion';
import { Captions } from './Captions';
import { usePlayerState } from '../PlayerProvider/playerContext';

export const expandDuration = 0.3;

export const Transcript = () => {
	const {
		videoInfo: { captions },
	} = usePlayerState();

	const [isExpanded, setIsExpanded] = useState(false);
	const captionsRef = useRef<ElementRef<typeof Captions>>(null);

	const handleToggleExpand = () => {
		setIsExpanded(!isExpanded);
		if (captionsRef.current) {
			captionsRef.current.centerActiveCaption();
		}
	};

	if (!captions.length) {
		return null;
	}

	return (
		<MotionConfig
			transition={{ type: 'ease-in-out', duration: expandDuration }}
		>
			<Top isExpanded={isExpanded} onToggleExpand={handleToggleExpand} />
			<Bottom
				captionsRef={captionsRef}
				isExpanded={isExpanded}
				onToggleExpand={handleToggleExpand}
			/>
			<TranscriptControls isExpanded={isExpanded} />
		</MotionConfig>
	);
};
