import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL) {
	throw new Error('Missing url env var from Upstash');
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
	throw new Error('Missing token env var from Upstash');
}

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
	redis: redis,
	limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export default async function middleware(
	request: NextRequest,
	event: NextFetchEvent
): Promise<Response | undefined> {
	const ip = request.ip ?? '127.0.0.1';
	const { success } = await ratelimit.limit(ip);
	return success
		? NextResponse.next()
		: NextResponse.redirect(new URL('/blocked', request.url));
}

export const config = {
	matcher: '/',
};
