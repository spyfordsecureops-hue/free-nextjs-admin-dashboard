import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * One-time admin user creation endpoint.
 * Uses the Supabase service role key to create a pre-confirmed admin user
 * (email confirmation is skipped so the user can log in immediately).
 *
 * POST body (optional JSON): { "email": "...", "password": "...", "firstName": "...", "lastName": "..." }
 * Defaults are used when no body is provided.
 */
export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        error: 'Missing Supabase configuration',
        env_check: {
          SUPABASE_URL: !!supabaseUrl,
          SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
        },
      },
      { status: 500 }
    );
  }

  let body: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  } = {};

  try {
    body = await request.json();
  } catch {
    // No body provided, use defaults
  }

  const email = body.email || 'spyfordsecureops@gmail.com';
  const password = body.password || 'Admin@123456';
  const firstName = body.firstName || 'Spyford';
  const lastName = body.lastName || 'Admin';

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Check if the user already exists
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let userId: string;
    let created = false;

    if (existing) {
      // Update the existing user's password and confirm their email
      userId = existing.id;
      await supabase.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          is_admin: true,
        },
      });
    } else {
      // Create a new pre-confirmed admin user
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          is_admin: true,
        },
      });

      if (error || !data.user) {
        return NextResponse.json(
          { error: 'Failed to create user', details: error?.message },
          { status: 500 }
        );
      }

      userId = data.user.id;
      created = true;
    }

    // Ensure the profile row reflects the admin role
    await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          role: 'admin',
        },
        { onConflict: 'id' }
      );

    return NextResponse.json({
      success: true,
      action: created ? 'created' : 'updated',
      message: created
        ? 'Admin user created and confirmed.'
        : 'Existing admin user updated with new password and confirmed.',
      credentials: {
        email,
        password,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to set up admin user', details: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({
      status: 'not_configured',
      message: 'Supabase service role key not available.',
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data } = await supabase.auth.admin.listUsers();

  return NextResponse.json({
    status: 'ok',
    user_count: data?.users?.length ?? 0,
    users: data?.users?.map((u) => ({
      email: u.email,
      confirmed: !!u.email_confirmed_at,
      is_admin: u.user_metadata?.is_admin ?? false,
    })),
  });
}
