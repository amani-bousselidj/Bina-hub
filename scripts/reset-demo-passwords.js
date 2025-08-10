import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Demo users to reset passwords
const demoUsers = [
  { email: 'user@binaa.com', password: 'demo123' },
  { email: 'store@binaa.com', password: 'demo123' },
  { email: 'service@binaa.com', password: 'demo123' },
  { email: 'admin@binaa.com', password: 'demo123' }
]

async function resetDemoPasswords() {
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

  console.log('Resetting demo user passwords...')

  for (const demoUser of demoUsers) {
    try {
      // Get user by email
      const { data: users, error: getUserError } = await supabase.auth.admin.listUsers()
      
      if (getUserError) {
        console.error(`Error getting users:`, getUserError.message)
        continue
      }

      const user = users.users.find(u => u.email === demoUser.email)
      
      if (!user) {
        console.log(`✗ User ${demoUser.email} not found`)
        continue
      }

      // Reset password
      const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
        password: demoUser.password,
        email_confirm: true // Ensure email is confirmed
      })

      if (error) {
        console.error(`✗ Error resetting password for ${demoUser.email}:`, error.message)
      } else {
        console.log(`✓ Reset password for: ${demoUser.email}`)
      }
    } catch (err) {
      console.error(`✗ Error with ${demoUser.email}:`, err.message)
    }
  }

  console.log('\nPassword reset complete!')
  console.log('Demo user credentials:')
  demoUsers.forEach(user => {
    console.log(`- ${user.email} / ${user.password}`)
  })
  console.log('\nTry the demo login buttons now.')
}

resetDemoPasswords().catch(console.error)
