import { openrouter } from '@/lib/ai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: openrouter('openai/gpt-4o-mini'),
      prompt: message,
    });

    return Response.json({
      response: result.text,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
