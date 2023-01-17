import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { Marquee } from './Marquee';
import { css } from '@emotion/react';

interface DetailsTextProps extends StyledComponent {
	title?: string;
	author?: string;
}
export const DetailsText = styled(
	({ className, title, author }: DetailsTextProps) => (
		<div className={className}>
			<Marquee
				text={title}
				textStyle={css`
					font-size: 1.5rem;
					font-weight: 500;
				`}
			/>
			<Marquee
				text={author}
				textStyle={css`
					font-size: 1rem;
					letter-spacing: 0.02em;
					opacity: 0.6;
				`}
			/>
		</div>
	)
)(css`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	flex-direction: column;
	line-height: 1.2;
`);
