import { Reducer } from 'react';
import { Caption } from '../types';

export interface TranscriptReducerState {
	isExpanded: boolean;
	isAnimating: boolean;
	captions: Caption[];
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
