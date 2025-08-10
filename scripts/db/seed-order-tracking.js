#!/usr/bin/env node
/*
 Minimal order + tracking seeder using RPCs:
 - Picks a couple of recent products
 - Calls checkout_guest_with_project_log(payload)
 - Prints order_number then validates via get_order_tracking

 Requires: DATABASE_URL (for product selection) and NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (for auth? Not needed; uses Postgres RPC via supabase client? We'll call via direct SQL functions with SECURITY DEFINER).
*/

import 'dotenv/config'
import { Client } from 'pg'

function resolvePg() {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.SUPABASE_DIRECT_URL
  if (url) return url
  const host = process.env.SUPABASE_DB_HOST || process.env.PGHOST
  const port = process.env.SUPABASE_DB_PORT || process.env.PGPORT || '5432'
  const db = process.env.SUPABASE_DB_NAME || process.env.PGDATABASE
  const user = process.env.SUPABASE_DB_USER || process.env.PGUSER
  const pass = process.env.SUPABASE_DB_PASSWORD || process.env.PGPASSWORD
  if (host && db && user && pass) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}`
  }
  return null
}

async function main() {
  const pgUrl = resolvePg()
  if (!pgUrl) {
    console.error('No Postgres connection string found. Set DATABASE_URL or SUPABASE_* parts.')
    process.exit(1)
  }

  const pg = new Client({ connectionString: pgUrl, application_name: 'seed-order-track' })
  await pg.connect()

  try {
    // Pick up to 2 recent products
    const prodRes = await pg.query(
      'select id, price from public.products order by created_at desc limit 2'
    )
    if (prodRes.rows.length === 0) {
      console.error('No products found; seed products first (npm run db:seed:demo)')
      process.exit(1)
    }

    const items = prodRes.rows.map((r) => ({ product_id: r.id, quantity: 1, unit_price: r.price || 1 }))
    const payload = {
      items,
      email: 'guest@example.com',
      phone: '+966555555555',
      name: 'Guest Seed',
      address: 'Riyadh',
    }

    // Call the RPC via SQL select on SECURITY DEFINER function
    const rpc = await pg.query('select public.checkout_guest_with_project_log($1::jsonb) as res', [JSON.stringify(payload)])
    const res = rpc.rows[0]?.res
    const orderNumber = res?.order_number
    if (!orderNumber) {
      console.error('Checkout RPC did not return order_number:', res)
      process.exit(1)
    }
    console.log('Created order_number:', orderNumber)

    // Validate tracking
    const track = await pg.query("select public.get_order_tracking($1::text, $2::text, $3::text) as res", [orderNumber, payload.email, payload.phone])
    const t = track.rows[0]?.res
    if (!t?.order) {
      console.error('Tracking failed to return order:', t)
      process.exit(1)
    }
    console.log('Tracking OK. Status:', t.order.status, 'Total:', t.order.total_amount)
  } catch (e) {
    console.error('Seeding order/track failed:', e)
    process.exit(1)
  } finally {
    await pg.end()
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})
