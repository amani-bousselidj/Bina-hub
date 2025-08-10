// Clean up duplicate user profiles
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service key to delete
);

async function cleanupDuplicates() {
  const email = 'testuser3@binna.com';
  const correctUserId = 'c3454f0c-6e2e-449b-a0a3-24f9d9180053'; // The authenticated user
  
  console.log('🧹 Cleaning up duplicate users for', email);
  
  // Get all users with this email
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email);
    
  if (error) {
    console.error('❌ Error fetching users:', error);
    return;
  }
  
  console.log('Found', users?.length || 0, 'users');
  
  // Delete old/incorrect users (keep only the authenticated one)
  for (const user of users || []) {
    if (user.user_id !== correctUserId) {
      console.log(`🗑️  Deleting old user: ${user.user_id} - ${user.display_name}`);
      
      // Delete associated data first
      await supabase.from('construction_projects').delete().eq('user_id', user.user_id);
      await supabase.from('orders').delete().eq('user_id', user.user_id);
      await supabase.from('warranties').delete().eq('user_id', user.user_id);
      
      // Delete the profile
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', user.user_id);
        
      if (deleteError) {
        console.error(`❌ Error deleting user ${user.user_id}:`, deleteError);
      } else {
        console.log(`✅ Deleted user ${user.user_id}`);
      }
    } else {
      console.log(`✅ Keeping authenticated user: ${user.user_id} - ${user.display_name}`);
    }
  }
  
  console.log('🎉 Cleanup complete!');
}

cleanupDuplicates();
