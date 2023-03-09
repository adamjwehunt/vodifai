'use client';

import { ClipboardButton } from '../ClipboardButton';
import { useTranscriptState } from '../TranscriptProvider/transcriptContext';

interface CopyTranscriptButtonProps {
	ariaLabel: string;
	icon: React.ReactNode;
  toast: string;
}

export const CopyTranscriptButton = (props: CopyTranscriptButtonProps) => {
	const { captions } = useTranscriptState();
	const transcript = captions.map((caption) => caption.text).join(' ');

	return <ClipboardButton {...props} text={transcript} />;
};
