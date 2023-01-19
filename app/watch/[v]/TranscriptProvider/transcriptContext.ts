import { createContext, Dispatch, RefObject, useContext } from 'react';
import { CaptionsHandle } from '../Transcript/Captions';
import { TranscriptReducerAction, TranscriptReducerState } from './types';

export const TranscriptStateContext =
	createContext<TranscriptReducerState | null>(null);
export const TranscriptStateDispatchContext =
	createContext<Dispatch<TranscriptReducerAction> | null>(null);
export const CaptionsRefContext =
	createContext<RefObject<CaptionsHandle> | null>(null);

export const useTranscriptState = () => {
	const transcriptState = useContext(TranscriptStateContext);

	if (transcriptState === null) {
		throw Error('TranscriptStateContext has not been provided.');
	}

	return transcriptState;
};

export const useTranscriptStateDispatch = () => {
	const transcriptStateDispatch = useContext(TranscriptStateDispatchContext);

	if (transcriptStateDispatch === null) {
		throw Error('TranscriptStateDispatchContext has not been provided.');
	}

	return transcriptStateDispatch;
};

export const useCaptionsRef = (): { centerActiveCaption: () => void } => {
	const captionsRef = useContext(CaptionsRefContext);

	if (captionsRef === null) {
		throw Error('CaptionsRefContext has not been provided.');
	}

	return {
		centerActiveCaption: () => captionsRef.current?.centerActiveCaption(),
	};
};
