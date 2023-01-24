'use client';

import { MotionConfig } from 'framer-motion';
import { useReducer, useRef, ReactElement } from 'react';
import { CaptionsHandle } from '../Transcript/Captions';
import { Caption } from '../types';
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

export const expandDuration = 0.3;

interface TranscriptProviderProps {
	children: ReactElement[];
	captions: Caption[];
}

export const TranscriptProvider = ({
	children,
	captions,
}: TranscriptProviderProps) => {
	const [transcriptState, transcriptStateDispatch] = useReducer(
		(previousState: TranscriptReducerState, action: TranscriptReducerAction) =>
			transcriptReducer(previousState, action),
		{ ...DEFAULT_TRANSCRIPT_REDUCER_STATE, captions }
	);

	const captionsRef = useRef<CaptionsHandle>(null);

	return (
		<TranscriptStateContext.Provider value={transcriptState}>
			<TranscriptStateDispatchContext.Provider value={transcriptStateDispatch}>
				<CaptionsRefContext.Provider value={captionsRef}>
					<MotionConfig
						transition={{ type: 'ease-in-out', duration: expandDuration }}
					>
						{children}
					</MotionConfig>
				</CaptionsRefContext.Provider>
			</TranscriptStateDispatchContext.Provider>
		</TranscriptStateContext.Provider>
	);
};
