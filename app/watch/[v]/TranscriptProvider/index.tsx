import { RefObject, ReactNode, Ref, useReducer, useRef } from 'react';
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
	children: (captionsRef: RefObject<CaptionsHandle>) => ReactNode;
}

export const TranscriptProvider = ({ children }: TranscriptProviderProps) => {
	const [transcriptState, transcriptStateDispatch] = useReducer(
		(previousState: TranscriptReducerState, action: TranscriptReducerAction) =>
			transcriptReducer(previousState, action),
		{ ...DEFAULT_TRANSCRIPT_REDUCER_STATE }
	);

	const captionsRef = useRef<CaptionsHandle>(null);

	return (
		<TranscriptStateContext.Provider value={transcriptState}>
			<TranscriptStateDispatchContext.Provider value={transcriptStateDispatch}>
				<CaptionsRefContext.Provider value={captionsRef}>
					{children(captionsRef)}
				</CaptionsRefContext.Provider>
			</TranscriptStateDispatchContext.Provider>
		</TranscriptStateContext.Provider>
	);
};
