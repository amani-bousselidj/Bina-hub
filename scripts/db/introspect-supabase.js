#!/usr/bin/env node
/*
 Introspect Supabase (Postgres) schema using env vars and output:
 - docs/schema/introspection.json (tables, columns, PKs, FKs, indexes)
 - docs/schema/ERD.mmd (Mermaid ER diagram)
 - docs/schema/SCHEMA_OVERVIEW.md (human-readable summary)

 Env precedence (first found is used):
 - DATABASE_URL (full Postgres URL)
 - SUPABASE_DB_URL
 - SUPABASE_DIRECT_URL
 - SUPABASE_CONNECTION_STRING
 - SUPABASE_DB_HOST + SUPABASE_DB_PORT + SUPABASE_DB_NAME + SUPABASE_DB_USER + SUPABASE_DB_PASSWORD
 - NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (via http fetch to pg schema is NOT supported here; we need direct pg)

 Usage:
   npm run db:introspect

 Note: Requires devDependency 'pg' and 'dotenv' which exist in this repo.
*/

import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import { Client } from 'pg';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function loadEnv() {
  // Load .env, .env.local if present
  const envFiles = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
  ];
  for (const f of envFiles) {
    if (fs.existsSync(f)) dotenv.config({ path: f });
  }
}

function buildPgUrlFromParts() {
  const host = process.env.SUPABASE_DB_HOST || process.env.PGHOST;
  const port = process.env.SUPABASE_DB_PORT || process.env.PGPORT || '5432';
  const db = process.env.SUPABASE_DB_NAME || process.env.PGDATABASE;
  const user = process.env.SUPABASE_DB_USER || process.env.PGUSER;
  const pass = process.env.SUPABASE_DB_PASSWORD || process.env.PGPASSWORD;
  if (host && db && user && pass) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}`;
  }
  return null;
}

function resolveConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.SUPABASE_DIRECT_URL ||
    process.env.SUPABASE_CONNECTION_STRING ||
    buildPgUrlFromParts()
  );
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function asSchemaArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  // Allow comma-separated list in env
  return String(x)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function query(client, text, params) {
  const res = await client.query(text, params);
  return res.rows;
}

async function main() {
  loadEnv();
  const conn = resolveConnectionString();
  if (!conn) {
    console.error('No Postgres connection string found. Set DATABASE_URL or SUPABASE_DB_URL (or parts).');
    process.exit(1);
  }

  const client = new Client({ connectionString: conn, application_name: 'schema-introspect' });
  await client.connect();

  try {
    // Limit to common app schemas
  const allowedSchemas = asSchemaArray(process.env.PG_SCHEMAS);
  if (!allowedSchemas.length) allowedSchemas.push('public');

    const tables = await query(
      client,
      `select table_schema, table_name
       from information_schema.tables
       where table_type = 'BASE TABLE' and table_schema = any($1)
       order by table_schema, table_name`,
      [allowedSchemas]
    );

    const views = await query(
      client,
      `select table_schema, table_name
       from information_schema.views
       where table_schema = any($1)
       order by table_schema, table_name`,
      [allowedSchemas]
    );

    const columns = await query(
      client,
      `select table_schema, table_name, column_name, data_type, is_nullable, column_default
       from information_schema.columns
       where table_schema = any($1)
       order by table_schema, table_name, ordinal_position`,
      [allowedSchemas]
    );

    const pks = await query(
      client,
      `select
         tc.table_schema,
         tc.table_name,
         kc.column_name,
         tc.constraint_name
       from information_schema.table_constraints tc
       join information_schema.key_column_usage kc
         on kc.constraint_name = tc.constraint_name
        and kc.table_schema = tc.table_schema
        and kc.table_name = tc.table_name
       where tc.constraint_type = 'PRIMARY KEY'
         and tc.table_schema = any($1)
       order by tc.table_schema, tc.table_name, kc.ordinal_position`,
      [allowedSchemas]
    );

    const fks = await query(
      client,
      `select
         tc.table_schema,
         tc.table_name,
         kcu.column_name,
         ccu.table_schema as foreign_table_schema,
         ccu.table_name as foreign_table_name,
         ccu.column_name as foreign_column_name,
         tc.constraint_name
       from information_schema.table_constraints as tc
       join information_schema.key_column_usage as kcu
         on tc.constraint_name = kcu.constraint_name
        and tc.table_schema = kcu.table_schema
       join information_schema.constraint_column_usage as ccu
         on ccu.constraint_name = tc.constraint_name
        and ccu.table_schema = tc.table_schema
       where tc.constraint_type = 'FOREIGN KEY'
         and tc.table_schema = any($1)
       order by tc.table_schema, tc.table_name, kcu.ordinal_position`,
      [allowedSchemas]
    );

    const indexes = await query(
      client,
      `select
         n.nspname as table_schema,
         t.relname as table_name,
         i.relname as index_name,
         pg_get_indexdef(ix.indexrelid) as index_def,
         ix.indisunique as is_unique
       from pg_class t
       join pg_namespace n on n.oid = t.relnamespace
       join pg_index ix on t.oid = ix.indrelid
       join pg_class i on i.oid = ix.indexrelid
       where t.relkind = 'r' and n.nspname = any($1)
       order by n.nspname, t.relname, i.relname`,
      [allowedSchemas]
    );

    // Build model
    const tablesMap = {};
    for (const t of tables) {
      const key = `${t.table_schema}.${t.table_name}`;
      tablesMap[key] = { ...t, columns: [], primaryKey: [], foreignKeys: [], indexes: [] };
    }

    // Attach columns
    for (const c of columns) {
      const key = `${c.table_schema}.${c.table_name}`;
      if (!tablesMap[key]) continue;
      tablesMap[key].columns.push({
        name: c.column_name,
        type: c.data_type,
        nullable: c.is_nullable === 'YES',
        default: c.column_default ?? null,
      });
    }

    // Attach PKs
    for (const pk of pks) {
      const key = `${pk.table_schema}.${pk.table_name}`;
      if (!tablesMap[key]) continue;
      tablesMap[key].primaryKey.push(pk.column_name);
    }

    // Attach FKs
    for (const fk of fks) {
      const key = `${fk.table_schema}.${fk.table_name}`;
      if (!tablesMap[key]) continue;
      tablesMap[key].foreignKeys.push({
        column: fk.column_name,
        references: `${fk.foreign_table_schema}.${fk.foreign_table_name}.${fk.foreign_column_name}`,
        name: fk.constraint_name,
      });
    }

    // Attach indexes
    for (const ix of indexes) {
      const key = `${ix.table_schema}.${ix.table_name}`;
      if (!tablesMap[key]) continue;
      tablesMap[key].indexes.push({ name: ix.index_name, unique: ix.is_unique, def: ix.index_def });
    }

    const model = {
      generatedAt: new Date().toISOString(),
      schemas: allowedSchemas,
      tables: Object.values(tablesMap),
      views,
    };

    // Outputs
    const outDir = path.resolve(process.cwd(), 'docs', 'schema');
    ensureDir(outDir);

    // JSON
    fs.writeFileSync(path.join(outDir, 'introspection.json'), JSON.stringify(model, null, 2), 'utf8');

    // Mermaid ER Diagram
    const er = [];
    er.push('erDiagram');
    for (const t of Object.values(tablesMap)) {
      const tName = `${t.table_schema}_${t.table_name}`;
      er.push(`  ${tName} {`);
      for (const c of t.columns) {
        const pkMark = t.primaryKey.includes(c.name) ? ' PK' : '';
        er.push(`    ${c.type} ${c.name}${pkMark}`);
      }
      er.push('  }');
    }
    for (const t of Object.values(tablesMap)) {
      const fromName = `${t.table_schema}_${t.table_name}`;
      for (const fk of t.foreignKeys) {
        const [s, tbl, col] = fk.references.split('.');
        const toName = `${s}_${tbl}`;
        // Many-to-one default depiction
        er.push(`  ${fromName} }o--|| ${toName} : "${fk.column} -> ${col}"`);
      }
    }
    fs.writeFileSync(path.join(outDir, 'ERD.mmd'), er.join('\n'), 'utf8');

    // Markdown Summary
    const md = [];
    md.push('# Database Schema Overview');
    md.push('');
    md.push(`Generated: ${model.generatedAt}`);
    md.push('');
    md.push('## Schemas');
    md.push('- ' + allowedSchemas.join(', '));
    md.push('');
    md.push('## Tables');
    for (const t of Object.values(tablesMap)) {
      md.push(`### ${t.table_schema}.${t.table_name}`);
      if (t.primaryKey.length) md.push(`- Primary Key: ${t.primaryKey.join(', ')}`);
      md.push('- Columns:');
      for (const c of t.columns) {
        md.push(`  - ${c.name}: ${c.type}${c.nullable ? '' : ' not null'}${c.default ? ` default ${c.default}` : ''}`);
      }
      if (t.foreignKeys.length) {
        md.push('- Foreign Keys:');
        for (const fk of t.foreignKeys) {
          md.push(`  - ${fk.name}: ${fk.column} -> ${fk.references}`);
        }
      }
      if (t.indexes.length) {
        md.push('- Indexes:');
        for (const ix of t.indexes) {
          md.push(`  - ${ix.name}${ix.unique ? ' (unique)' : ''}: ${ix.def}`);
        }
      }
      md.push('');
    }
    if (views.length) {
      md.push('## Views');
      for (const v of views) {
        md.push(`- ${v.table_schema}.${v.table_name}`);
      }
    }

    fs.writeFileSync(path.join(outDir, 'SCHEMA_OVERVIEW.md'), md.join('\n'), 'utf8');

    console.log('Introspection complete. Outputs written to docs/schema/.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Introspection failed:', err);
  process.exit(1);
});
