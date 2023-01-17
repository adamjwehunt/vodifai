export interface Video {
	type: string;
	id: string;
}

export interface PlayerInfo {}

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
