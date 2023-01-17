import { SecondaryButton } from './SecondaryButton';
import FileDownloadIcon from '../../../../public/file-download-icon.svg';

export const DownloadButton = () => {
	const handleDownloadButtonClick = () => {};

	return (
		<SecondaryButton
			icon={FileDownloadIcon}
			ariaLabel={'Open downloads menu'}
			onClick={handleDownloadButtonClick}
		/>
	);
};
