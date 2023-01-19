import { Reducer } from 'react';

export interface TranscriptReducerState {
	isExpanded: boolean;
	isAnimating: boolean;
}

export type TranscriptReducerAction =
	| {
			type: 'toggleExpand';
	  }
	| {
			type: 'animateStart';
	  }
	| {
			type: 'animateEnd';
	  };

export type TranscriptReducer = Reducer<
	TranscriptReducerState,
	TranscriptReducerAction
>;
