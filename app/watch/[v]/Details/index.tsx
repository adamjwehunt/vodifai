import styled from '@emotion/styled';
import { StyledComponent, VideoDetails } from '../types';
import { DetailsText } from './DetailsText';
import { css } from '@emotion/react';

interface DetailsProps extends StyledComponent {
	videoDetails: VideoDetails | null;
}

export const Details = styled(({ className, videoDetails }: DetailsProps) => {
	if (!videoDetails) {
		return null;
	}

	const {
		title,
		author: { name: authorName },
	}: { title?: string; author: { name: string } } = videoDetails;

	return (
		<div className={className}>
			<DetailsText title={title} author={authorName} />
		</div>
	);
})(css`
	display: flex;
	width: 100%;
	margin-bottom: 1rem;
`);
