import {
	TranscriptReducer,
	TranscriptReducerAction,
	TranscriptReducerState,
} from './types';

export const DEFAULT_TRANSCRIPT_REDUCER_STATE: TranscriptReducerState =
	Object.freeze({
		isExpanded: false,
		isAnimating: false,
		captions: [],
		videoDetails: {},
		highlightedWord: '',
		centeredCaptionId: null,
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
		case 'animateComplete':
			return {
				...previousState,
				isAnimating: false,
			};
		case 'highlightTranscriptWord':
			return {
				...previousState,
				highlightedWord: action.word,
			};
		case 'centerCaption':
			return {
				...previousState,
				centeredCaptionId: action.captionId,
			};

		default:
			return previousState;
	}
};
