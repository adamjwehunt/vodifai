import { Player } from './Player';

export default function WrappedEditor({ playerRef, ...props }: any) {
	return <Player {...props} playerRef={playerRef} />;
}
