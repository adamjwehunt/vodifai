import { Caption, OpenAIStreamPayload } from '@/app/types';
import { Chapter } from 'ytdl-core';
import { OpenAIStream } from '../../../lib/OpenAIStream';
import { createRecapPrompt } from '../../../lib/recapPrompt';

const AI_MODEL = 'text-davinci-003';
const MAX_REQUEST = 4097;
const RECAP_LENGTH = 280;

if (!process.env.OPENAI_API_KEY) {
	throw new Error('Missing env var from OpenAI');
}
export const runtime = 'edge';

interface RecapRequestBody {
	title?: string;
	keywords?: string[];
	description?: string;
	chapters?: Chapter[];
	captions?: Caption[];
}

export async function POST(request: Request) {
	const { title, keywords, description, captions, chapters } =
		(await request.json()) as RecapRequestBody;

	const prompt = createRecapPrompt(
		title || '',
		keywords?.join(' ') || '',
		description || '',
		captions || [],
		chapters || [],
		MAX_REQUEST - RECAP_LENGTH
	);

	if (!prompt) {
		return new Response('No prompt in the request', { status: 400 });
	}

	const payload: OpenAIStreamPayload = {
		model: AI_MODEL,
		prompt,
		temperature: 0.7,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		max_tokens: RECAP_LENGTH,
		stream: true,
		n: 1,
	};

	const stream = await OpenAIStream(payload);

	return new Response(stream);
}
