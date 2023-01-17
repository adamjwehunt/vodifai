interface ThumbnailProps {
	thumbnailUrl?: string;
}

export const Thumbnail = ({ thumbnailUrl }: ThumbnailProps) => {
	if (!thumbnailUrl) {
		return null;
	}

	return <img src={thumbnailUrl} />;
};
