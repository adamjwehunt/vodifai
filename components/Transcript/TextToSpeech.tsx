import { useTts } from 'tts-react';
import type { TTSHookProps } from 'tts-react';
import { forwardRef, useEffect, useImperativeHandle } from 'react';

interface TextToSpeechProps extends TTSHookProps {
	ref?: React.RefObject<HTMLDivElement>;
}

export interface TextToSpeechRef {
	play: () => void;
	pause: () => void;
	isPlaying: boolean;
}

export const TextToSpeech = forwardRef(function TextToSpeech(
	{ children, onStart, onEnd, onPause }: TextToSpeechProps,
	ref
) {
	const { ttsChildren, state, play, stop, pause } = useTts({
		children,
		markTextAsSpoken: true,
		onStart,
		onPause,
		onEnd,
	});

	useEffect(() => {
		return () => {
			stop();
		};
	}, [stop]);

	useImperativeHandle(ref, () => ({
		play: () => play(),
		pause: () => pause(),
		isPlaying: state.isPlaying,
	}));

	return <div>{ttsChildren}</div>;
});
