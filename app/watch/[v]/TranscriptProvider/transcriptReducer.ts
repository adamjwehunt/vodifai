import {
	TranscriptReducer,
	TranscriptReducerAction,
	TranscriptReducerState,
} from './types';

export const DEFAULT_TRANSCRIPT_REDUCER_STATE: TranscriptReducerState =
	Object.freeze({
		isExpanded: false,
		isAnimating: false,
	});

export const transcriptReducer: TranscriptReducer = (
	previousState: TranscriptReducerState,
	action: TranscriptReducerAction
): TranscriptReducerState => {
	switch (action.type) {
		case 'toggleExpand':
			return {
				...previousState,
				isExpanded: !previousState.isExpanded,
			};
		case 'animateStart':
			return {
				...previousState,
				isAnimating: true,
			};
		case 'animateEnd':
			return {
				...previousState,
				isAnimating: false,
			};

		default:
			return previousState;
	}
};
