export interface Video {
	type: string;
	id: string;
}

export interface Caption {
	id: number;
	start: number;
	duration: number;
	text: string;
}

export interface ChapterWithCaptions {
	title: string;
	start_time: number;
	captions: Caption[];
}

export interface VideoFormat {
	itag: number;
	container: string;
	qualityLabel: string;
	bitrate?: number;
	type?: string;
	contentLength: string;
}

export interface Download {
	format: VideoFormat;
	url: string;
}

export interface Downloads {
	videoFormats: Download[];
	audioFormats: Download[];
}


