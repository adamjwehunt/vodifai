import { Download } from 'app/types';
import styles from '../watch.module.scss';

interface DownloadItemsProps {
	formats: Download[];
	header: string;
}

export const DownloadItems = ({ formats, header }: DownloadItemsProps) => {
	const formatGroups: { [key: string]: Download[] } = {};
	formats.forEach(({ format, url }) => {
		const key = format.qualityLabel;
		if (formatGroups[key]) {
			formatGroups[key].push({ format, url });
		} else {
			formatGroups[key] = [{ format, url }];
		}
	});

	return (
		<>
			<h3>{header}</h3>
			{Object.keys(formatGroups).map((qualityLabel) => (
				<div key={qualityLabel} className={styles.formatGroup}>
					<div className={styles.qualityLabel}>{qualityLabel}</div>
					<div className={styles.formatLinks}>
						{formatGroups[qualityLabel].map(({ format, url }, index) => (
							<DownloadItem key={index} format={format} url={url} />
						))}
					</div>
				</div>
			))}
		</>
	);
};

interface DownloadItemProps {
	format: Download['format'];
	url: Download['url'];
}

const DownloadItem = ({ format, url }: DownloadItemProps) => (
	<a href={url} target="_blank" download key={format.itag}>
		<div>{format.container}</div>
		<div>{format.contentLength}</div>
	</a>
);
