#!/usr/bin/env node
/*
 Create two auth users via Supabase Admin API, ensure a store for one, and map products to that store via store_products.
 Users:
  - user@binaa.com, password: demo 123
  - store@binaa.com, password: demo123

 Requirements:
  - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in .env/.env.local
  - DATABASE_URL or PG parts for direct SQL (to link users to public.stores user_id and store_products.user_id)
*/

import 'dotenv/config'
import fetch from 'node-fetch'
import { Client } from 'pg'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env')
  process.exit(1)
}

const authUrl = `${SUPABASE_URL}/auth/v1/admin/users`

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

async function ensureUser(email, password) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${SERVICE_KEY}`,
    apikey: SERVICE_KEY,
  }

  // Check if user exists by email (list filter)
  const existing = await fetch(`${authUrl}?email=${encodeURIComponent(email)}`, {
    headers,
  })
  const list = await existing.json()
  const found = Array.isArray(list.users) ? list.users.find((u) => u.email === email) : null
  if (found) return found

  const res = await fetch(authUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { seeded: true },
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Failed to create user ${email}: ${res.status} ${t}`)
  }
  return res.json()
}

function extractId(userObj) {
  // Supabase Admin returns object with user.id; list returns user objects too
  return userObj.id || (userObj.user && userObj.user.id)
}

async function main() {
  const pgUrl = resolvePg()
  if (!pgUrl) {
    console.error('No Postgres connection string found. Set DATABASE_URL or SUPABASE_* parts.')
    process.exit(1)
  }
  const pg = new Client({ connectionString: pgUrl, application_name: 'seed-users-store' })
  await pg.connect()

  try {
    const u1 = await ensureUser('user@binaa.com', 'demo 123')
    const u2 = await ensureUser('store@binaa.com', 'demo123')
    const userId1 = extractId(u1)
    const userId2 = extractId(u2)

    await pg.query('begin')

    // Ensure a store for store user
    const storeRes = await pg.query(
      `insert into public.stores (user_id, store_name, name, address, is_active, created_at)
       values ($1, $2, $3, $4, true, now())
       on conflict (store_id) do nothing
       returning id, user_id`,
      [userId2, 'متجر بِنّاء', 'Binaa Store', 'Riyadh']
    )

    // Fetch store id by user_id if returning nothing
    let store = storeRes.rows[0]
    if (!store) {
      const q = await pg.query('select id, user_id from public.stores where user_id = $1 limit 1', [userId2])
      store = q.rows[0]
    }

    // Map existing products to store_products if not mapped yet
    const prodRes = await pg.query('select id, name, barcode, price from public.products order by created_at desc limit 10')
    for (const pr of prodRes.rows) {
      if (!pr.barcode) continue
      await pg.query(
        `insert into public.store_products (id, title, sku, price, status, created_at, updated_at, user_id)
         values (gen_random_uuid()::text, $1, $2, $3, 'published', now(), now(), $4)
         on conflict (id) do nothing`,
        [pr.name, pr.barcode, pr.price, store.user_id]
      )
    }

    await pg.query('commit')
    console.log('Seeded users, store, and product mappings.')
  } catch (e) {
    await pg.query('rollback')
    console.error('Seeding failed:', e)
    process.exit(1)
  } finally {
    await pg.end()
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})
