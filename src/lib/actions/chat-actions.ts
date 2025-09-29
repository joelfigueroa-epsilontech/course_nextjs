'use server';

import type { Chat, Message } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createChat(): Promise<{ chatId: string } | { error: string }> {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Create a new chat
    const { data: chat, error } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        title: 'New Chat',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat:', error);
      return { error: 'Failed to create chat' };
    }

    revalidatePath('/chat');
    return { chatId: chat.id };
  } catch (error) {
    console.error('Error in createChat:', error);
    return { error: 'Failed to create chat' };
  }
}

export async function deleteChat(chatId: string): Promise<{ success: boolean } | { error: string }> {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Delete the chat (messages will be deleted automatically due to CASCADE)
    const { error } = await supabase.from('chats').delete().eq('id', chatId).eq('user_id', user.id);

    if (error) {
      console.error('Error deleting chat:', error);
      return { error: 'Failed to delete chat' };
    }

    revalidatePath('/chat');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteChat:', error);
    return { error: 'Failed to delete chat' };
  }
}

export async function getUserChats(): Promise<Chat[]> {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return [];
    }

    // Get user's chats
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching chats:', error);
      return [];
    }

    return chats || [];
  } catch (error) {
    console.error('Error in getUserChats:', error);
    return [];
  }
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return [];
    }

    // Verify the chat belongs to the user and get messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select(
        `
        *,
        chats!inner (
          user_id
        )
      `
      )
      .eq('chat_id', chatId)
      .eq('chats.user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }

    return messages || [];
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    return [];
  }
}

export async function updateChatTitle(chatId: string, title: string): Promise<{ success: boolean } | { error: string }> {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Update the chat title
    const { error } = await supabase.from('chats').update({ title }).eq('id', chatId).eq('user_id', user.id);

    if (error) {
      console.error('Error updating chat title:', error);
      return { error: 'Failed to update chat title' };
    }

    revalidatePath('/chat');
    return { success: true };
  } catch (error) {
    console.error('Error in updateChatTitle:', error);
    return { error: 'Failed to update chat title' };
  }
}
