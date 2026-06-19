'use client';

import React from 'react';

interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

interface CasesListProps {
  cases: Case[];
  selectedCase: Case | null;
  onSelectCase: (caseItem: Case) => void;
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const priorityColors: Record<string, string> = {
  low: 'bg-green-50 border-l-4 border-green-500',
  medium: 'bg-yellow-50 border-l-4 border-yellow-500',
  high: 'bg-orange-50 border-l-4 border-orange-500',
  critical: 'bg-red-50 border-l-4 border-red-500',
};

export function CasesList({ cases, selectedCase, onSelectCase }: CasesListProps) {
  if (cases.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <p className="font-medium">No cases yet</p>
          <p className="text-sm">Create a new case to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {cases.map((caseItem) => (
        <button
          key={caseItem.id}
          onClick={() => onSelectCase(caseItem)}
          className={`w-full text-left p-3 border-b border-border transition-colors ${
            selectedCase?.id === caseItem.id
              ? 'bg-primary/10'
              : 'hover:bg-muted'
          } ${priorityColors[caseItem.priority]}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate text-sm">{caseItem.title}</h3>
              <p className="text-xs text-muted-foreground truncate mt-1 line-clamp-2">
                {caseItem.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[caseItem.status]}`}>
              {caseItem.status}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
