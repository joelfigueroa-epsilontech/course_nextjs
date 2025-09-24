'use client';

import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { createChat, deleteChat, getUserChats } from '@/lib/actions/chat-actions';
import type { Chat } from '@/lib/database.types';
import { ArrowLeft, Bot, Loader2, MessageSquare, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const router = useRouter();

  // Load user chats on mount
  useEffect(() => {
    const loadChats = async () => {
      setIsLoadingChats(true);
      const userChats = await getUserChats();
      setChats(userChats);
      setIsLoadingChats(false);

      // If there are chats, redirect to the first one
      if (userChats.length > 0) {
        router.push(`/chat/${userChats[0].id}`);
      }
    };

    loadChats();
  }, [router]);

  const handleCreateChat = async () => {
    const result = await createChat();
    if ('chatId' in result) {
      router.push(`/chat/${result.chatId}`);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    const result = await deleteChat(chatId);
    if ('success' in result && result.success) {
      const userChats = await getUserChats();
      setChats(userChats);

      // If no chats left, stay on this page
      if (userChats.length === 0) {
        setIsLoadingChats(false);
      } else {
        // Redirect to the first available chat
        router.push(`/chat/${userChats[0].id}`);
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-muted/30 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b space-y-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button onClick={handleCreateChat} className="w-full justify-start" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chats List */}
        <div className="flex-1 p-2 overflow-y-auto">
          {isLoadingChats ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center text-muted-foreground p-4 text-sm">No chats yet. Create your first chat to get started!</div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="group relative flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  <MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(chat.updated_at).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area - Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Bot className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
          <h2 className="text-2xl font-semibold mb-4">Welcome to AI Chat</h2>
          <p className="text-muted-foreground mb-6">
            {chats.length === 0
              ? 'Create your first chat to start a conversation with the AI assistant.'
              : 'Select a chat from the sidebar or create a new one to get started.'}
          </p>
          <Button onClick={handleCreateChat} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Start New Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
