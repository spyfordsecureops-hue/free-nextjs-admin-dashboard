'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessagingCenter } from '@/components/messaging/MessagingCenter';
import { useRouter } from 'next/navigation';

export default function SecureMessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    checkAuth();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading messaging center...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <MessagingCenter userId={user.id} userEmail={user.email} />
    </div>
  );
}
