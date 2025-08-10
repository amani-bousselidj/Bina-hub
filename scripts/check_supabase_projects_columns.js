// Script to check columns in the Supabase 'projects' table using anon key from .env
// Usage: node scripts/check_supabase_projects_columns.js

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fetch = require('node-fetch');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error('Neither SUPABASE_ANON_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY found in .env file.');
  process.exit(1);
}

console.log('Using Supabase key:', SUPABASE_ANON_KEY === process.env.SUPABASE_ANON_KEY ? 'SUPABASE_ANON_KEY' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

async function checkProjectsColumns(useServiceRole = false) {
  const apiKey = useServiceRole && SUPABASE_SERVICE_ROLE_KEY ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY;
  if (useServiceRole && !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found, falling back to anon/public key.');
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/construction_projects?limit=1`, {
    headers: {
      'apikey': apiKey,
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    console.error('Failed to fetch projects:', res.status, await res.text());
    return;
  }
  const data = await res.json();
  if (data.length === 0) {
    console.log('No projects found.');
    return;
  }
  console.log('Project columns:', Object.keys(data[0]));
  console.log('Project sample:', data[0]);
}

// Default: use anon/public key. To use service role, run: node scripts/check_supabase_projects_columns.js service
const useServiceRole = process.argv[2] === 'service';
checkProjectsColumns(useServiceRole);
