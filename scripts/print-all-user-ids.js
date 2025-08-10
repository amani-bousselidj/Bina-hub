// Script to fetch and print all user IDs, emails, and display names from Supabase
// Run this in a Node.js environment with your Supabase credentials set in .env

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function printAllUserIds() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id, email, display_name');

    if (error) {
      console.error('Error fetching user profiles:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('No user profiles found.');
      return;
    }

    console.log('User IDs, Emails, and Display Names:');
    data.forEach((user) => {
      console.log(`user_id: ${user.user_id} | email: ${user.email} | display_name: ${user.display_name}`);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

printAllUserIds();
