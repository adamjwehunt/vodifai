import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import {
	useCaptionsRef,
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import Icon from '@/public/expand-icon.svg';
import { css } from '@emotion/react';

const ExpandIcon = styled(Icon)`
	display: flex;
	height: 100%;
	fill: #fff;
	max-width: 100%;

	&:focus {
		outline: none;
	}
`;

export const ExpandButton = styled(({ className }: StyledComponent) => {
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const { centerActiveCaption } = useCaptionsRef();
	const { isExpanded } = useTranscriptState();

	const handleExpandButtonClick = () => {
		transcriptStateDispatch({ type: 'toggleExpand' });
		centerActiveCaption();
	};

	return (
		<button
			className={className}
			aria-label={'Menu'}
			tabIndex={isExpanded ? -1 : 0}
			onClick={handleExpandButtonClick}
		>
			<ExpandIcon />
		</button>
	);
})(css`
	background-color: hsla(0, 0%, 0%, 0.3);
	border-radius: 50%;
	padding: 0.3rem;
	height: 100%;
`);
