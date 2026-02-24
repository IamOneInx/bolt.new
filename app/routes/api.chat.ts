import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/.server/llm/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

async function chatAction({ context, request }: ActionFunctionArgs) {
  const { messages, apiKeys } = await request.json<{ messages: Messages; apiKeys?: Record<string, string> }>();

  const stream = new SwitchableStream();

  try {
    const options: StreamingOptions = {
      toolChoice: 'none',
      onFinish: async ({ text: content, finishReason, usage }) => {
        if (finishReason !== 'length') {
          return stream.close();
        }

        if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
          throw new Error(`Cannot continue message: Maximum segments (${MAX_RESPONSE_SEGMENTS}) reached`);
        }

        const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;

        console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);

        messages.push({ role: 'assistant', content });
        messages.push({ role: 'user', content: CONTINUE_PROMPT });

        const result = await streamText(messages, context.cloudflare.env, options, apiKeys);

        return stream.switchSource(result.toAIStream());
      },
    };

    const result = await streamText(messages, context.cloudflare.env, options, apiKeys);

    stream.switchSource(result.toAIStream());

    return new Response(stream.readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: unknown) {
    console.error('Chat action error:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    const isRateLimit = message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('429');
    const isAuth = message.toLowerCase().includes('auth') || message.toLowerCase().includes('api key') || message.toLowerCase().includes('401');

    if (isRateLimit) {
      throw new Response('Rate limit exceeded. Please wait before sending another message.', {
        status: 429,
        statusText: 'Too Many Requests',
      });
    }

    if (isAuth) {
      throw new Response('Invalid or missing API key for the selected provider.', {
        status: 401,
        statusText: 'Unauthorized',
      });
    }

    throw new Response(`Chat error: ${message}`, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
