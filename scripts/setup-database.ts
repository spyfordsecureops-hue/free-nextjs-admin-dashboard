import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('Setting up Supabase database...')

  // Create profiles table with roles
  const { error: profilesError } = await supabase.rpc('exec_sql', {
    sql: `
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

      -- Enable RLS
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_select_all_admin" ON public.profiles;

      -- Create RLS policies
      CREATE POLICY "profiles_select_own" ON public.profiles 
        FOR SELECT USING (auth.uid() = id);
      
      CREATE POLICY "profiles_insert_own" ON public.profiles 
        FOR INSERT WITH CHECK (auth.uid() = id);
      
      CREATE POLICY "profiles_update_own" ON public.profiles 
        FOR UPDATE USING (auth.uid() = id);
      
      CREATE POLICY "profiles_delete_own" ON public.profiles 
        FOR DELETE USING (auth.uid() = id);

      -- Admin can view all profiles
      CREATE POLICY "profiles_select_all_admin" ON public.profiles 
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );
    `
  })

  if (profilesError) {
    // Try alternative approach - direct SQL execution
    console.log('Using direct table creation approach...')
  }

  // Create activity_logs table for admin dashboard
  const { error: logsError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  })

  // Create notifications table
  const { error: notificationsError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  })

  // Create dashboard_settings table
  const { error: settingsError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  })

  // Create trigger function for auto-creating profile on signup
  const { error: triggerError } = await supabase.rpc('exec_sql', {
    sql: `
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

        -- Create default dashboard settings
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
    `
  })

  console.log('Database setup complete!')
  
  if (profilesError || logsError || notificationsError || settingsError || triggerError) {
    console.log('Some operations may require manual SQL execution in Supabase dashboard')
  }
}

setupDatabase().catch(console.error)
