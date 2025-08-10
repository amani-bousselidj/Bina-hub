// Test script to find user with the most data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findUserWithMostData() {
  const userIds = [
    'admin', 'contractor', 'store', 'user@binna.com',
    'demo-user2-1753743761088', 'demo-store2-1753743761208', 
    'demo-contractor2-1753743761325', 'demo-designer-1753743761442',
    'demo-supplier-1753743761556'
  ];

  console.log('=== Finding user with most data ===\n');

  let bestUser = null;
  let maxDataCount = 0;

  for (const userId of userIds) {
    console.log(`\n--- Testing user: ${userId} ---`);
    
    try {
      // Check profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Check projects
      const { data: projectsData } = await supabase
        .from('construction_projects')
        .select('*')
        .eq('user_id', userId);

      // Check orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      // Check warranties
      const { data: warrantiesData } = await supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId);

      const dataCount = (profileData ? 1 : 0) + 
                       (projectsData?.length || 0) + 
                       (ordersData?.length || 0) + 
                       (warrantiesData?.length || 0);

      console.log(`Profile: ${profileData ? '✅' : '❌'}`);
      console.log(`Projects: ${projectsData?.length || 0}`);
      console.log(`Orders: ${ordersData?.length || 0}`);
      console.log(`Warranties: ${warrantiesData?.length || 0}`);
      console.log(`Total data items: ${dataCount}`);

      if (dataCount > maxDataCount) {
        maxDataCount = dataCount;
        bestUser = {
          userId,
          profile: !!profileData,
          projects: projectsData?.length || 0,
          orders: ordersData?.length || 0,
          warranties: warrantiesData?.length || 0,
          totalItems: dataCount
        };
      }

    } catch (error) {
      console.log(`❌ Error testing ${userId}:`, error.message);
    }
  }

  console.log('\n=== RESULTS ===');
  if (bestUser) {
    console.log(`🏆 Best user: ${bestUser.userId}`);
    console.log(`📊 Data summary:`);
    console.log(`   Profile: ${bestUser.profile ? 'Yes' : 'No'}`);
    console.log(`   Projects: ${bestUser.projects}`);
    console.log(`   Orders: ${bestUser.orders}`);
    console.log(`   Warranties: ${bestUser.warranties}`);
    console.log(`   Total items: ${bestUser.totalItems}`);
    
    console.log(`\n💡 Recommendation: Use "${bestUser.userId}" as the default user ID in the context.`);
  } else {
    console.log('❌ No user found with data.');
  }
}

findUserWithMostData();
