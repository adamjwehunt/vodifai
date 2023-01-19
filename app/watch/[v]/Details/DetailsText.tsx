import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { Marquee } from './Marquee';
import { css } from '@emotion/react';
import { usePlayerState } from '../PlayerProvider/playerContext';

export const DetailsText = styled(({ className }: StyledComponent) => {
	const {
		videoInfo: {
			videoDetails: {
				title,
				author: { name: authorName },
			},
		},
	} = usePlayerState();

	return (
		<div className={className}>
			<Marquee
				text={title}
				textStyle={css`
					font-size: 1.5rem;
					font-weight: 500;
				`}
			/>
			<Marquee
				text={authorName}
				textStyle={css`
					font-size: 1rem;
					letter-spacing: 0.02em;
					opacity: 0.6;
				`}
			/>
		</div>
	);
})(css`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	flex-direction: column;
	line-height: 1.2;
`);
