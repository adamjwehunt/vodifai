import { Caption, VideoDetails } from 'app/types';
import { Reducer } from 'react';

export interface TranscriptReducerState {
	isExpanded: boolean;
	isAnimating: boolean;
	captions: Caption[];
	videoDetails: Partial<VideoDetails>;
	highlightedWord: string;
	centeredCaptionId: number | null;
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
	  }
	| {
			type: 'highlightTranscriptWord';
			word: string;
	  }
	| {
			type: 'centerCaption';
			captionId: number | null;
	  };

export type TranscriptReducer = Reducer<
	TranscriptReducerState,
	TranscriptReducerAction
>;
