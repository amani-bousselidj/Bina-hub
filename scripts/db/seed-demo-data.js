#!/usr/bin/env node
/*
 Seed minimal demo data so the marketplace shows numbers on the frontend.
 Inserts:
  - One store (public.stores)
  - 3 products (public.products)
  - Map products to store via public.store_products using barcode<->sku and owner mapping (user_id)

 Reads DATABASE_URL or SUPABASE_* parts from .env/.env.local.
*/

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import url from 'url'
import { Client } from 'pg'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

function loadEnv() {
  const envFiles = [path.resolve(process.cwd(), '.env.local'), path.resolve(process.cwd(), '.env')]
  for (const f of envFiles) if (fs.existsSync(f)) dotenv.config({ path: f })
}

function buildPgUrlFromParts() {
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

function resolveConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.SUPABASE_DIRECT_URL ||
    process.env.SUPABASE_CONNECTION_STRING ||
    buildPgUrlFromParts()
  )
}

function randBarcode(prefix) {
  return `${prefix}${Math.floor(100000 + Math.random() * 899999)}`
}

async function main() {
  loadEnv()
  const conn = resolveConnectionString()
  if (!conn) {
    console.error('No Postgres connection string found. Set DATABASE_URL or SUPABASE_* parts.')
    process.exit(1)
  }

  const client = new Client({ connectionString: conn, application_name: 'seed-demo' })
  await client.connect()

  try {
    await client.query('begin')

    // Insert demo products (no store dependency)
    const products = [
      { name: 'Cement Bag 50kg', name_ar: 'أسمنت 50كجم', price: 18.5, category: 'مواد البناء' },
      { name: 'Steel Rebar 12mm', name_ar: 'حديد تسليح 12مم', price: 12.0, category: 'حديد' },
      { name: 'Sand (1m³)', name_ar: 'رمل (1م³)', price: 7.0, category: 'مواد البناء' },
    ]

    const productRows = []
    for (const p of products) {
      const barcode = randBarcode('BN')
      const pr = await client.query(
        `insert into public.products (name, name_ar, barcode, price, category, quantity_in_stock, status, created_at, updated_at)
         values ($1, $2, $3, $4, $5, $6, 'active', now(), now())
         returning id, barcode, name` ,
        [p.name, p.name_ar, barcode, p.price, p.category, Math.floor(Math.random() * 200) + 10]
      )
      productRows.push(pr.rows[0])
    }

    await client.query('commit')
    console.log('Seed completed. Inserted demo products.')
  } catch (e) {
    await client.query('rollback')
    console.error('Seed failed:', e)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})
