import styled from '@emotion/styled';
import { StyledComponent } from './types';
import { css } from '@emotion/react';

interface SecondaryButtonProps extends StyledComponent {
	icon: any;
	ariaLabel: string;
	onClick: () => void;
}

export const SecondaryButton = styled(
	({ className, icon: Icon, ariaLabel, onClick }: SecondaryButtonProps) => (
		<button aria-label={ariaLabel} onClick={onClick}>
			<Icon className={className} />
		</button>
	)
)(css`
	display: flex;
	height: 100%;
	fill: #fff;
`);
