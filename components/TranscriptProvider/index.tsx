'use client';

import { Caption, VideoDetails } from '@/app/types';
import { useReducer, useRef, ReactElement } from 'react';
import { CaptionsHandle } from '../Transcript/Captions';
import {
	TranscriptStateContext,
	TranscriptStateDispatchContext,
	CaptionsRefContext,
} from './transcriptContext';
import {
	transcriptReducer,
	DEFAULT_TRANSCRIPT_REDUCER_STATE,
} from './transcriptReducer';
import { TranscriptReducerState, TranscriptReducerAction } from './types';

interface TranscriptProviderProps {
	children: ReactElement[];
	captions: Caption[];
	videoDetails: VideoDetails;
}

export const TranscriptProvider = ({
	children,
	captions,
	videoDetails,
}: TranscriptProviderProps) => {
	const [transcriptState, transcriptStateDispatch] = useReducer(
		(previousState: TranscriptReducerState, action: TranscriptReducerAction) =>
			transcriptReducer(previousState, action),
		{ ...DEFAULT_TRANSCRIPT_REDUCER_STATE, captions, videoDetails }
	);

	const captionsRef = useRef<CaptionsHandle>(null);

	return (
		<TranscriptStateContext.Provider value={transcriptState}>
			<TranscriptStateDispatchContext.Provider value={transcriptStateDispatch}>
				<CaptionsRefContext.Provider value={captionsRef}>
					{children}
				</CaptionsRefContext.Provider>
			</TranscriptStateDispatchContext.Provider>
		</TranscriptStateContext.Provider>
	);
};
