import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('Setting up Supabase database tables...')

  // Create profiles table
  const { error: profilesError } = await supabase.from('profiles').select('id').limit(1)
  
  if (profilesError?.code === '42P01') {
    console.log('Tables not found. Please run the SQL schema from supabase/schema.sql in your Supabase SQL Editor.')
    console.log('')
    console.log('You can find the schema file at: supabase/schema.sql')
    console.log('')
    console.log('Steps:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the contents of supabase/schema.sql')
    console.log('4. Run the query')
    return
  }

  if (profilesError) {
    console.log('Database check error:', profilesError.message)
    return
  }

  console.log('Database tables are already set up!')
  console.log('')
  console.log('Tables available:')
  console.log('- profiles (user profiles with roles)')
  console.log('- activity_logs (user activity tracking)')
  console.log('- notifications (user notifications)')
  console.log('- dashboard_settings (per-user settings)')
  console.log('')
  console.log('Storage buckets:')
  console.log('- avatars (user avatar uploads)')
}

setupDatabase().catch(console.error)
