export interface Video {
	type: string;
	id: string;
}

export interface CaptionTrack {
	baseUrl: string;
	isTranslatable: boolean;
	languageCode: string;
	name: { simpleText: string };
	vssId: string;
}

export interface Caption {
	id: number;
	start: number;
	duration: number;
	text: string;
}

export interface StyledComponent {
	className?: string;
	style?: React.CSSProperties;
}

export interface VideoFormat {
	itag: number;
	url: string;
	mimeType?: string;
	bitrate?: number;
	audioBitrate?: number;
	width?: number;
	height?: number;
	initRange?: { start: string; end: string };
	indexRange?: { start: string; end: string };
	lastModified: string;
	contentLength: string;
	quality:
		| 'tiny'
		| 'small'
		| 'medium'
		| 'large'
		| 'hd720'
		| 'hd1080'
		| 'hd1440'
		| 'hd2160'
		| 'highres'
		| string;
	qualityLabel:
		| '144p'
		| '144p 15fps'
		| '144p60 HDR'
		| '240p'
		| '240p60 HDR'
		| '270p'
		| '360p'
		| '360p60 HDR'
		| '480p'
		| '480p60 HDR'
		| '720p'
		| '720p60'
		| '720p60 HDR'
		| '1080p'
		| '1080p60'
		| '1080p60 HDR'
		| '1440p'
		| '1440p60'
		| '1440p60 HDR'
		| '2160p'
		| '2160p60'
		| '2160p60 HDR'
		| '4320p'
		| '4320p60';
	projectionType?: 'RECTANGULAR';
	fps?: number;
	averageBitrate?: number;
	audioQuality?: 'AUDIO_QUALITY_LOW' | 'AUDIO_QUALITY_MEDIUM';
	colorInfo?: {
		primaries: string;
		transferCharacteristics: string;
		matrixCoefficients: string;
	};
	highReplication?: boolean;
	approxDurationMs?: string;
	targetDurationSec?: number;
	maxDvrDurationSec?: number;
	audioSampleRate?: string;
	audioChannels?: number;

	// Added by ytdl-core
	container: 'flv' | '3gp' | 'mp4' | 'webm' | 'ts';
	hasVideo: boolean;
	hasAudio: boolean;
	codecs: string;
	videoCodec?: string;
	audioCodec?: string;

	isLive: boolean;
	isHLS: boolean;
	isDashMPD: boolean;
}

export interface VideoDetails {
	title: string;
	description: string | null;
	author: {
		name: string;
		id: string;
	};
}

export interface VideoInfo {
	id: string;
	url: string;
	captions: Caption[];
	videoDetails: VideoDetails;
	formats: VideoFormat[];
}
