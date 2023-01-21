import styles from './transcript.module.scss';

interface CaptionTextProps {
	isHighlighted: boolean;
	text: string;
	captionRef: ((activeCaption: HTMLDivElement) => void) | null;
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const CaptionText = ({
	isHighlighted,
	text,
	captionRef,
	onClick,
}: CaptionTextProps) => (
	<div
		className={styles.captionText}
		style={isHighlighted ? { color: '#fff' } : {}}
		ref={captionRef}
		onClick={onClick}
	>
		{text}
	</div>
);
