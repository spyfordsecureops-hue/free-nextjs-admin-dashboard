'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface MessageThreadProps {
  caseId: string;
  selectedCase: Case;
  userId: string;
  onCaseUpdated: (caseItem: Case) => void;
}

export function MessageThread({ caseId, selectedCase, userId, onCaseUpdated }: MessageThreadProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[v0] Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to real-time message updates
    const subscription = supabase
      .channel(`messages_${caseId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `case_id=eq.${caseId}` },
        (payload: any) => {
          console.log('[v0] New message:', payload);
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            case_id: caseId,
            user_id: userId,
            content: newMessage,
          },
        ]);

      if (error) {
        console.error('[v0] Error sending message:', error);
      } else {
        setNewMessage('');
      }
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const { data, error } = await supabase
      .from('cases')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', caseId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error updating case status:', error);
    } else if (data) {
      onCaseUpdated(data);
    }
  };

  const priorityColors: Record<string, string> = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-orange-600 bg-orange-50',
    critical: 'text-red-600 bg-red-50',
  };

  const statusColors: Record<string, string> = {
    open: 'text-blue-600 bg-blue-50',
    in_progress: 'text-yellow-600 bg-yellow-50',
    resolved: 'text-green-600 bg-green-50',
    closed: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{selectedCase.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{selectedCase.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <select
              value={selectedCase.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-3 py-1 rounded-full font-medium text-sm border transition-colors ${statusColors[selectedCase.status]} border-current/20`}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <span className={`px-3 py-1 rounded-full font-medium text-sm border ${priorityColors[selectedCase.priority]} border-current/20`}>
              {selectedCase.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary">A</span>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-foreground text-sm break-words">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4 bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 rounded-md bg-muted text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
