import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { DownloadButton } from './DownloadButton';
import { ShareButton } from './ShareButton';
import { css } from '@emotion/react';

export const SecondaryControls = styled(({ className }: StyledComponent) => (
	<div className={className}>
		<DownloadButton />
		<ShareButton />
	</div>
))(css`
	justify-content: space-between;
	display: flex;
	margin-top: -0.5rem;
	width: 100%;
	height: 1.5rem;
`);
