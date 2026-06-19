'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CasesList } from './CasesList';
import { MessageThread } from './MessageThread';
import { NewCaseDialog } from './NewCaseDialog';

interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

interface MessagingCenterProps {
  userId: string;
  userEmail: string;
}

export function MessagingCenter({ userId, userEmail }: MessagingCenterProps) {
  const supabase = createClient();
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);

  // Fetch cases on mount and subscribe to changes
  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('[v0] Error fetching cases:', error);
      } else {
        setCases(data || []);
        if (data && data.length > 0 && !selectedCase) {
          setSelectedCase(data[0]);
        }
      }
      setLoading(false);
    };

    fetchCases();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('cases_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cases' },
        (payload: any) => {
          console.log('[v0] Case update:', payload);
          fetchCases();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, selectedCase]);

  const handleCaseCreated = (newCase: Case) => {
    setCases([newCase, ...cases]);
    setSelectedCase(newCase);
    setShowNewCaseDialog(false);
  };

  const handleCaseUpdated = (updatedCase: Case) => {
    setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
    setSelectedCase(updatedCase);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Cases List Sidebar */}
      <div className="w-full md:w-80 border-r border-border flex flex-col bg-background">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Cases & Messages</h2>
          <button
            onClick={() => setShowNewCaseDialog(true)}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            New Case
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading cases...</p>
            </div>
          </div>
        ) : (
          <CasesList
            cases={cases}
            selectedCase={selectedCase}
            onSelectCase={setSelectedCase}
          />
        )}
      </div>

      {/* Message Thread */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedCase ? (
          <MessageThread
            caseId={selectedCase.id}
            selectedCase={selectedCase}
            userId={userId}
            onCaseUpdated={handleCaseUpdated}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">No case selected</p>
              <p className="text-sm">Select a case to view messages</p>
            </div>
          </div>
        )}
      </div>

      {/* New Case Dialog */}
      {showNewCaseDialog && (
        <NewCaseDialog
          userId={userId}
          onClose={() => setShowNewCaseDialog(false)}
          onCaseCreated={handleCaseCreated}
        />
      )}
    </div>
  );
}
