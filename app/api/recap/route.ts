import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { streamText, convertToCoreMessages } from 'ai';

class RateLimitError extends Error {
	constructor(payload: { data: { limit: number }; message: string }) {
		super(JSON.stringify(payload));
		this.name = 'RateLimitError';
	}
}

const isProd: boolean =
	process.env.VERCEL_ENV === 'production' && process.env.IS_PROD === 'true';

async function modelId(): Promise<string> {
	if (!isProd) {
		return 'openai:gpt-4o';
	}
	return 'openai:gpt-4o-mini';
}

const ratelimit = new Ratelimit({
	limiter: Ratelimit.fixedWindow(100, '1h'),
	redis: Redis.fromEnv(),
});

import { createRecapPrompt } from '@/lib/recapPrompt';
import { createOpenAI } from '@ai-sdk/openai';
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai';

const registry = createProviderRegistry({
	openai: createOpenAI({
		apiKey: process.env.OPENAI_API_KEY,
		compatibility: 'strict',
	}),
});

export const runtime = 'edge';
interface RecapRequestBody {
	title?: string;
	keywords?: string[];
	description?: string;
	chapters?: any[];
	captions?: any[];
}

export async function POST(req: NextRequest) {
	const h = await headers();
	const ip = h.get('true-client-ip') || h.get('x-real-ip');

	if (isProd) {
		const { remaining, success } = await ratelimit.limit(ip || '');
		if (!success) {
			throw new RateLimitError({
				data: { limit: remaining },
				message: 'Rate limit exceeded',
			});
		}
	}

	const { title, keywords, description, chapters, captions } =
		(await req.json()) as RecapRequestBody;

	// 4) Build your big transcript prompt
	const recapPrompt = createRecapPrompt(
		title || '',
		(keywords || []).join(' '),
		description || '',
		captions || [],
		chapters || [],
		4000
	);
	console.log(
		`app/api/recap/route.ts - 75 => recapPrompt: `,
		'\n',
		recapPrompt
	);
	if (!recapPrompt) {
		return new Response('No prompt in the request', { status: 400 });
	}

	const messages = convertToCoreMessages([
		{ role: 'user', content: recapPrompt },
	]);

	const chosenModelId = await modelId();
	const model = registry.languageModel(chosenModelId);

	const result = await streamText({
		model,
		messages,
		maxRetries: 3,
	});

	return result.toDataStreamResponse({
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
