import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Demo users to confirm
const demoEmails = [
  'user@binaa.com',
  'store@binaa.com',
  'service@binaa.com',
  'admin@binaa.com'
]

async function confirmDemoUsers() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    return
  }

  // Create admin client (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('Confirming demo user emails...')

  for (const email of demoEmails) {
    try {
      // Get user by email
      const { data: users, error: getUserError } = await supabase.auth.admin.listUsers()
      
      if (getUserError) {
        console.error(`Error getting users:`, getUserError.message)
        continue
      }

      const user = users.users.find(u => u.email === email)
      
      if (!user) {
        console.log(`✗ User ${email} not found`)
        continue
      }

      if (user.email_confirmed_at) {
        console.log(`✓ User ${email} already confirmed`)
        continue
      }

      // Confirm the user's email
      const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
        email_confirm: true
      })

      if (error) {
        console.error(`✗ Error confirming ${email}:`, error.message)
      } else {
        console.log(`✓ Confirmed email for: ${email}`)
      }
    } catch (err) {
      console.error(`✗ Error with ${email}:`, err.message)
    }
  }

  console.log('\nEmail confirmation complete!')
  console.log('Try the demo login buttons now.')
}

confirmDemoUsers().catch(console.error)
