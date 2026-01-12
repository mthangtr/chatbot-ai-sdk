import { openrouter } from '@/lib/ai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { ARBITER_SYSTEM_PROMPT } from '@/lib/arbiter-system-prompt';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages || messages.length === 0) {
      return Response.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const result = streamText({
      model: openrouter('openai/gpt-4o-mini'),
      system: ARBITER_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
