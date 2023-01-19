import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import { SecondaryButton } from './SecondaryButton';
import ShareIcon from '@/public/share-icon.svg';
import { css } from '@emotion/react';

export const ShareButton = styled(({ className }: StyledComponent) => {
	const handleShareButtonClick = () => {};

	return (
		<SecondaryButton
			icon={ShareIcon}
			ariaLabel={'Share Video'}
			onClick={handleShareButtonClick}
			className={className}
		/>
	);
})(css`
	padding: 0.125rem;
`);
