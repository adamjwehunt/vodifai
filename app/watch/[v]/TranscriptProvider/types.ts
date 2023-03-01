import { Reducer } from 'react';
import { Caption, VideoDetails } from '../types';

export interface TranscriptReducerState {
	isExpanded: boolean;
	isAnimating: boolean;
	captions: Caption[];
	videoDetails: VideoDetails;
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
