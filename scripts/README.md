# CSV to Supabase Migration

This directory contains the database schema and migration scripts for importing PE deal data from CSV files into Supabase.

## Quick Start

### 1. Set up Supabase Connection

Copy `.env.example` to `.env` and add your Supabase credentials:

```bash
cp .env.example .env
# Edit .env and add your SUPABASE_CONNECTION_STRING
```

### 2. Create Database Schema

Run the SQL schema in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `scripts/db/schema.sql`
4. Paste and execute in the SQL Editor

### 3. Run Migration

**Dry run first (recommended):**

```bash
npm run migrate:csv:dry-run
```

**Run actual migration:**

```bash
npm run migrate:csv
```

## Files

- **`scripts/db/schema.sql`** - PostgreSQL schema with normalized tables
- **`scripts/migrate-csv-to-supabase.ts`** - TypeScript migration script
- **`.env.example`** - Environment variable template

## Database Schema

### Tables

- **`startups`** - Company information
- **`founders`** - Founder information (normalized)
- **`investors`** - Investor information (normalized)
- **`startup_founders`** - Many-to-many relationship
- **`funding_rounds`** - Investment transactions

### Views

- **`startup_profiles`** - Complete startup data with aggregations
- **`investor_portfolios`** - Investor portfolio summaries

## Migration Features

✅ Idempotent (can be run multiple times safely)
✅ Transaction-based for data integrity
✅ Handles duplicates with upsert logic
✅ Parses complex CSV data (amounts, dates, comma-separated lists)
✅ Detailed error logging
✅ Progress reporting
✅ Dry-run mode for testing

## Verification Queries

After migration, verify the data:

```sql
-- Total counts
SELECT COUNT(*) FROM startups;
SELECT COUNT(*) FROM funding_rounds;

-- Sample company profile
SELECT * FROM startup_profiles WHERE name = 'BharatPe';

-- Top investors by portfolio size
SELECT * FROM investor_portfolios ORDER BY companies_invested DESC LIMIT 10;
```
