import { VideoInfo } from 'app/types';
import { Reducer } from 'react';

export interface PlayerReducerState {
	isPlaying: boolean;
	isSeeking: boolean;
	hasSeeked: boolean;
	isBuffering: boolean;
	duration: number;
	played: number;
	videoInfo: VideoInfo;
	toast: string;
}

export type PlayerReducerAction =
	| {
			type: 'url';
			url: string;
	  }
	| {
			type: 'play';
	  }
	| {
			type: 'pause';
	  }
	| {
			type: 'seekStart';
			seconds: number;
	  }
	| {
			type: 'seekEnd';
			seconds: number;
	  }
	| {
			type: 'seekComplete';
	  }
	| {
			type: 'buffer';
	  }
	| {
			type: 'bufferEnd';
	  }
	| {
			type: 'duration';
			seconds: number;
	  }
	| {
			type: 'played';
			seconds: number;
	  }
	| {
			type: 'toggleToast';
			message: string;
	  };

export type PlayerReducer = Reducer<PlayerReducerState, PlayerReducerAction>;
