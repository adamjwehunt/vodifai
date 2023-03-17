import ReactPlayerLazy, {
	ReactPlayerProps as ReactPlayerLazyProps,
} from 'react-player/lazy';

interface ReactPlayerProps extends ReactPlayerLazyProps {
	playerRef: React.RefObject<ReactPlayerLazy> | null;
}

export default function ReactPlayer({ playerRef, ...props }: ReactPlayerProps) {
	return <ReactPlayerLazy {...props} ref={playerRef} />;
}
