import { createClient } from '@/lib/supabase/server';
import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, chatId }: { messages: UIMessage[]; chatId?: string } = await req.json();

    // Get the authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the chat belongs to the user if chatId is provided
    if (chatId) {
      const { data: chat, error: chatError } = await supabase.from('chats').select('id').eq('id', chatId).eq('user_id', user.id).single();

      if (chatError || !chat) {
        return Response.json({ error: 'Chat not found' }, { status: 404 });
      }
    }

    // Save the user message to the database
    if (chatId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        // Extract text content from UIMessage parts
        const textContent = lastMessage.parts
          .filter((part) => part.type === 'text')
          .map((part) => part.text)
          .join('');

        await supabase.from('messages').insert({
          chat_id: chatId,
          role: 'user',
          content: textContent,
        });
      }
    }

    // Generate AI response using Google's AI
    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages: convertToModelMessages(messages),
      async onFinish({ text }) {
        // Save the assistant message to the database
        if (chatId) {
          await supabase.from('messages').insert({
            chat_id: chatId,
            role: 'assistant',
            content: text,
          });

          // Update chat title if this is the first message
          const { data: chatMessages } = await supabase.from('messages').select('id').eq('chat_id', chatId).limit(2);

          if (chatMessages && chatMessages.length <= 2) {
            // Generate a title from the first user message
            const firstUserMessage = messages.find((m: UIMessage) => m.role === 'user');
            if (firstUserMessage) {
              const textContent = firstUserMessage.parts
                .filter((part) => part.type === 'text')
                .map((part) => part.text)
                .join('');
              const title = textContent.slice(0, 50).trim();
              await supabase
                .from('chats')
                .update({ title: title + (title.length >= 50 ? '...' : '') })
                .eq('id', chatId);
            }
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
