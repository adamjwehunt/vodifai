import styled from '@emotion/styled';
import { StyledComponent } from '../types';
import {
	useCaptionsRef,
	useTranscriptState,
	useTranscriptStateDispatch,
} from '../TranscriptProvider/transcriptContext';
import ChevronBackIcon from '../../../../public/chevron-back-icon.svg';
import { css } from '@emotion/react';

const ChevronDownIcon = styled(ChevronBackIcon)`
	transform: rotate(-90deg);
	fill: #fff;
	margin-top: -0.3em;

	&:focus {
		outline: none;
	}
`;

export const MinimizeButton = styled(({ className }: StyledComponent) => {
	const transcriptStateDispatch = useTranscriptStateDispatch();
	const { centerActiveCaption } = useCaptionsRef();
	const { isExpanded } = useTranscriptState();

	const handleMinimizeButtonClick = () => {
		transcriptStateDispatch({ type: 'toggleExpand' });
		centerActiveCaption();
	};

	return (
		<button
			className={className}
			aria-label={'Menu'}
			color="primary"
			tabIndex={isExpanded ? 0 : -1}
			onClick={handleMinimizeButtonClick}
		>
			<ChevronDownIcon />
		</button>
	);
})(css`
	background-color: hsla(0, 0%, 0%, 0.3);
	height: 2rem;
	width: 2rem;
	border-radius: 50%;
	padding: 0 0.4rem;
	flex-shrink: 0;
`);
