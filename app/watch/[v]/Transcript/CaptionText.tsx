import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { css } from '@emotion/react';

interface CaptionTextProps extends StyledComponent {
	isHighlighted: boolean;
	text: string;
	captionRef: ((activeCaption: HTMLDivElement) => void) | null;
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const CaptionText = styled(
	({ className, text, captionRef, onClick }: CaptionTextProps) => (
		<div className={className} ref={captionRef} onClick={onClick}>
			{text}
		</div>
	)
)(
	({ isHighlighted }) => css`
		color: rgba(0, 0, 0, 0.7);
		font-size: 1.8rem;
		font-weight: 600;
		padding: 0 1.5rem 1.5rem;

		&:first-letter {
			text-transform: capitalize;
		}

		${isHighlighted &&
		css`
			color: #fff;
		`};
	`
);
