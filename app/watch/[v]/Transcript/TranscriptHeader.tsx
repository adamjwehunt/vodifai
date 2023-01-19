import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { ExpandButton } from './ExpandButton';
import { css } from '@emotion/react';

export const TranscriptHeader = styled(({ className }: StyledComponent) => (
	<div className={className}>
		<div>{'Transcript'}</div>
		<ExpandButton />
	</div>
))(css`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 0.7rem;
	font-size: 1.1rem;
	font-weight: 600;
	height: 3rem;
`);
