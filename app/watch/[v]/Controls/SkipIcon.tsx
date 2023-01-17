import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { css } from '@emotion/react';

interface SkipIconProps extends StyledComponent {
	icon: any;
}

export const SkipIcon = styled(({ icon: Icon, className }: SkipIconProps) => (
	<Icon className={className} />
))(css`
	fill: hsla(0, 0%, 100%, 1);
`);
