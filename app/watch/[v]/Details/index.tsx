import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { DetailsText } from './DetailsText';
import { css } from '@emotion/react';

export const Details = styled(({ className }: StyledComponent) => {
	return (
		<div className={className}>
			<DetailsText />
		</div>
	);
})(css`
	display: flex;
	width: 100%;
	margin-bottom: 1rem;
`);
