'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { createChat, deleteChat, getUserChats } from '@/lib/actions/chat-actions';
import type { Chat } from '@/lib/database.types';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ArrowLeft, Bot, Loader2, MessageSquare, Plus, Send, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;

  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        chatId,
      },
    }),
  });

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user chats on mount
  useEffect(() => {
    const loadChats = async () => {
      setIsLoadingChats(true);
      const userChats = await getUserChats();
      setChats(userChats);
      setIsLoadingChats(false);
    };

    loadChats();
  }, []);

  // Load messages for the current chat
  // Note: With new AI SDK, initial messages should be passed via initialMessages prop
  // This is handled differently - we'll focus on new messages for now

  const handleCreateChat = async () => {
    const result = await createChat();
    if ('chatId' in result) {
      const userChats = await getUserChats();
      setChats(userChats);
      window.location.href = `/chat/${result.chatId}`;
    }
  };

  const handleDeleteChat = async (chatIdToDelete: string) => {
    const result = await deleteChat(chatIdToDelete);
    if ('success' in result && result.success) {
      const userChats = await getUserChats();
      setChats(userChats);
      if (chatId === chatIdToDelete) {
        window.location.href = '/chat';
      }
    }
  };

  const currentChat = chats.find((chat) => chat.id === chatId);

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
                  className={`group relative flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    chatId === chat.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => (window.location.href = `/chat/${chat.id}`)}
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {currentChat && (
          <div className="p-4 border-b">
            <h1 className="text-lg font-semibold">{currentChat.title}</h1>
            <p className="text-sm text-muted-foreground">Created {new Date(currentChat.created_at).toLocaleDateString()}</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start the conversation</h3>
                <p className="text-sm">Type a message below to begin chatting with the AI assistant.</p>
              </div>
            ) : (
              messages.map((message: UIMessage) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <Card className={`max-w-[80%] p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                    {message.parts.map((part, partIndex) => {
                      if (part.type === 'text') {
                        return message.role === 'user' ? (
                          <p key={partIndex} className="text-sm leading-relaxed">
                            {part.text}
                          </p>
                        ) : (
                          <div key={partIndex} className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{part.text}</ReactMarkdown>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </Card>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <Separator />

        {/* Input Form */}
        <div className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput('');
              }
            }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                autoFocus
              />
              <Button type="submit" disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
