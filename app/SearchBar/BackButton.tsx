'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/react';
import { StyledComponent } from 'app/watch/[v]/types';

interface BackButtonProps extends StyledComponent {
	children: React.ReactNode;
}

export const BackButton = styled(({ className, children }: BackButtonProps) => {
	const router = useRouter();

	return (
		<button onClick={() => router.back()} className={className}>
			{children}
		</button>
	);
})(css`
	padding: 0 0.5rem;
`);
