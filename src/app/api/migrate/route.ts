import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const schemaSql = `
-- Create enum for user roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_logs_select_own" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_insert_own" ON public.activity_logs;

CREATE POLICY "activity_logs_select_own" ON public.activity_logs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "activity_logs_insert_own" ON public.activity_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;

CREATE POLICY "notifications_select_own" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON public.notifications 
  FOR DELETE USING (auth.uid() = user_id);

-- Create dashboard_settings table
CREATE TABLE IF NOT EXISTS public.dashboard_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light',
  sidebar_collapsed BOOLEAN DEFAULT FALSE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dashboard_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dashboard_settings_select_own" ON public.dashboard_settings;
DROP POLICY IF EXISTS "dashboard_settings_insert_own" ON public.dashboard_settings;
DROP POLICY IF EXISTS "dashboard_settings_update_own" ON public.dashboard_settings;

CREATE POLICY "dashboard_settings_select_own" ON public.dashboard_settings 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "dashboard_settings_insert_own" ON public.dashboard_settings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dashboard_settings_update_own" ON public.dashboard_settings 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger function for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.dashboard_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS dashboard_settings_updated_at ON public.dashboard_settings;
CREATE TRIGGER dashboard_settings_updated_at
  BEFORE UPDATE ON public.dashboard_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for avatars (may fail if storage not available)
DO $$ 
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN undefined_table THEN null;
END $$;
`;

export async function POST() {
  const postgresUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

  if (!postgresUrl) {
    return NextResponse.json(
      { 
        error: 'Missing database connection', 
        hint: 'POSTGRES_URL or POSTGRES_URL_NON_POOLING environment variable is required' 
      },
      { status: 500 }
    );
  }

  // Supabase's pooler presents a self-signed cert chain. Disable TLS rejection
  // for this server-side migration connection so the schema can be applied.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const pool = new Pool({ 
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    
    try {
      // Execute the entire schema
      await client.query(schemaSql);
      
      // Verify tables were created
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'activity_logs', 'notifications', 'dashboard_settings')
        ORDER BY table_name;
      `);
      
      const tables = tablesResult.rows.map(r => r.table_name);
      
      return NextResponse.json({
        success: true,
        message: 'Database schema applied successfully',
        tables_created: tables,
        details: {
          profiles: tables.includes('profiles'),
          activity_logs: tables.includes('activity_logs'),
          notifications: tables.includes('notifications'),
          dashboard_settings: tables.includes('dashboard_settings'),
        }
      });
    } finally {
      client.release();
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to apply schema', 
        details: error 
      },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}

export async function GET() {
  const postgresUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!postgresUrl && !supabaseUrl) {
    return NextResponse.json({
      status: 'not_configured',
      message: 'Database connection not available. The environment variables will be available after publishing to Vercel.',
      env_check: {
        POSTGRES_URL: !!postgresUrl,
        SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
      }
    });
  }

  const pool = new Pool({ 
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    
    try {
      // Check existing tables
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'activity_logs', 'notifications', 'dashboard_settings')
        ORDER BY table_name;
      `);
      
      const tables = tablesResult.rows.map(r => r.table_name);
      const allTablesExist = tables.length === 4;
      
      return NextResponse.json({
        status: allTablesExist ? 'ready' : 'needs_migration',
        tables_found: tables,
        missing_tables: ['profiles', 'activity_logs', 'notifications', 'dashboard_settings'].filter(t => !tables.includes(t)),
        message: allTablesExist 
          ? 'Database schema is up to date' 
          : 'POST to this endpoint to apply schema migrations'
      });
    } finally {
      client.release();
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({
      status: 'error',
      error: error
    });
  } finally {
    await pool.end();
  }
}
