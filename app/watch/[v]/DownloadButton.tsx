'use client';

interface DownloadButtonProps {
	ariaLabel: string;
	icon: React.ReactNode;
}

export const DownloadButton = ({ ariaLabel, icon }: DownloadButtonProps) => {
	const handleOnDownloadButtonClick = () => {};

	return (
		<button aria-label={ariaLabel} onClick={handleOnDownloadButtonClick}>
			{icon}
		</button>
	);
};
