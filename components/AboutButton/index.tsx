'use client';

import { useRef } from 'react';
import InfoIcon from '@/public/info-icon.svg';
import Link from 'next/link';
import MailIcon from '@/public/mail-icon.svg';
import LinkedInIcon from '@/public/linked-in-icon.svg';
import GithubIcon from '@/public/github-icon.svg';
import TwitterIcon from '@/public/twitter-icon.svg';
import BmcButton from '@/public/bmc-button.svg';
import { Modal, ModalRef } from 'components/Modal';
import styles from './aboutButton.module.scss';

interface AboutButtonProps {
	buttonClassName?: string;
	label?: boolean;
}

export const AboutButton = ({
	buttonClassName,
	label = false,
}: AboutButtonProps) => {
	const modalRef = useRef<ModalRef>(null);

	const handleShowInfoModal = () => {
		modalRef.current?.open();
	};

	return (
		<>
			<button
				className={buttonClassName}
				aria-label={'About'}
				onClick={handleShowInfoModal}
			>
				<InfoIcon className={styles.infoIcon} />
				{!label ? null : 'About'}
			</button>
			<Modal ref={modalRef} title={'About Vodifai'}>
				<div className={styles.aboutText}>
					<div>{'Heyo 👋,'}</div>
					<div>
						{
							'I built Vodifai to provide a simple way to view, search, and copy Youtube transcripts.'
						}
					</div>
					<div>
						{
							'I incorporated design elements from Spotify for a cleaner interface than YouTube.'
						}
					</div>
					<div>
						{
							'For fun I added an "AI Recap". Powered by OpenAI, this feature provides a (sometimes humorous 😅) summary of a video\'s transcript. Enjoy!'
						}
					</div>
					<div className={styles.name}>
						{'- Adam'}
						<div className={styles.socialIcons}>
							<Link href="mailto:adamjwehunt@gmail.com">
								<MailIcon />
							</Link>
							<Link href="https://linkedin.com/in/ajwehunt" target="_blank">
								<LinkedInIcon />
							</Link>
							<Link href="https://github.com/adamjwehunt" target="_blank">
								<GithubIcon />
							</Link>
							<Link href="https://twitter.com/home" target="_blank">
								<TwitterIcon />
							</Link>
						</div>
					</div>
				</div>
				<div className={styles.bmcLinkWrapper}>
					<Link
						className={styles.bmcLink}
						href="https://www.buymeacoffee.com/adamwehunt"
					>
						<BmcButton />
					</Link>
				</div>
			</Modal>
		</>
	);
};
