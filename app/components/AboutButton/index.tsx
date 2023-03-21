'use client';

import { useRef } from 'react';
import InfoIcon from '@/public/info-icon.svg';
import MailIcon from '@/public/mail-icon.svg';
import LinkedInIcon from '@/public/linked-in-icon.svg';
import GithubIcon from '@/public/github-icon.svg';
import BmcButton from '@/public/bmc-button.svg';
import { Modal, ModalRef } from 'app/components/Modal';
import styles from './aboutButton.module.scss';

interface AboutButtonProps {
	buttonClassName?: string;
}

export const AboutButton = ({ buttonClassName }: AboutButtonProps) => {
	const modalRef = useRef<ModalRef>(null);

	const handleShowInfoModal = () => {
		modalRef.current?.open();
	};

	return (
		<>
			<button
				className={buttonClassName}
				aria-label={'About Vodifai'}
				onClick={handleShowInfoModal}
			>
				<InfoIcon className={styles.infoIcon} />
				{'About'}
			</button>
			<Modal ref={modalRef} title={'About Vodifai'}>
				<div className={styles.aboutText}>
					<div>{'Hi,'}</div>
					<div>
						{
							'I built this site to provide a simple way to download Youtube videos and view transcripts.'
						}
					</div>
					<div>
						{
							"I incorporated design elements from Spotify, resulting in a cleaner interface than YouTube's."
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
							<a href="mailto:adamjwehunt@gmail.com">
								<MailIcon />
							</a>
							<a href="https://linkedin.com/in/ajwehunt" target="_blank">
								<LinkedInIcon />
							</a>
							<a href="https://github.com/adamjwehunt" target="_blank">
								<GithubIcon />
							</a>
						</div>
					</div>
				</div>
				<a
					className={styles.bmcLink}
					href="https://www.buymeacoffee.com/adamwehunt"
				>
					<BmcButton />
				</a>
			</Modal>
		</>
	);
};
