#!/usr/bin/env tsx
/**
 * CSV to Supabase Migration Script
 *
 * Migrates all CSV files from data/2020 and data/2021 directories
 * into a normalized PostgreSQL schema in Supabase.
 *
 * Usage:
 *   npm run migrate:csv              # Run migration
 *   npm run migrate:csv:dry-run      # Test without inserting data
 *
 * Environment Variables Required:
 *   SUPABASE_CONNECTION_STRING or (SUPABASE_URL + SUPABASE_DB_PASSWORD)
 */

import { config } from "dotenv";
import * as fs from "fs";
import Papa from "papaparse";
import * as path from "path";
import postgres from "postgres";

// Load environment variables
config();

// =====================================================
// Configuration
// =====================================================

const DRY_RUN = process.argv.includes("--dry-run");
const DATA_DIRS = ["data/2020", "data/2021"];

// Build connection string
const CONNECTION_STRING =
  process.env.SUPABASE_CONNECTION_STRING ||
  `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@${process.env.SUPABASE_URL?.replace("https://", "").replace("http://", "")}:5432/postgres`;

if (!CONNECTION_STRING.includes("postgresql://")) {
  console.error("❌ Error: Invalid Supabase connection configuration");
  console.error("Please set either:");
  console.error("  - SUPABASE_CONNECTION_STRING");
  console.error("  - or both SUPABASE_URL and SUPABASE_DB_PASSWORD");
  process.exit(1);
}

// =====================================================
// Types
// =====================================================

interface CSVRow {
  "Startup Name": string;
  "Founding Date": string;
  City: string;
  "Industry/Vertical": string;
  "Sub-Vertical": string;
  Founders: string;
  Investors: string;
  "Amount(in USD)": string;
  "Investment Stage": string;
}

interface MigrationStats {
  filesProcessed: number;
  rowsProcessed: number;
  startupsInserted: number;
  startupsUpdated: number;
  foundersInserted: number;
  investorsInserted: number;
  fundingRoundsInserted: number;
  errors: Array<{ file: string; row: number; error: string }>;
}

// =====================================================
// Database Connection
// =====================================================

const sql = DRY_RUN
  ? null
  : postgres(CONNECTION_STRING, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

// =====================================================
// Utility Functions
// =====================================================

/**
 * Parse amount string to numeric value
 * Examples: "$3,000,000" -> 3000000, "Undisclosed" -> null
 */
function parseAmount(amountStr: string): number | null {
  if (!amountStr || amountStr.toLowerCase().includes("undisclosed")) {
    return null;
  }

  const cleaned = amountStr.replace(/[$,]/g, "").trim();
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse founding date to Date object
 * Handles various formats and invalid dates
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === "") {
    return null;
  }

  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Extract funding date from filename
 * Example: "Jan_2020.csv" -> new Date("2020-01-01")
 */
function extractFundingDate(filename: string): Date | null {
  const match = filename.match(/([A-Za-z]+)_(\d{4})\.csv/);
  if (!match) return null;

  const [, month, year] = match;
  const monthMap: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const monthNum = monthMap[month];
  return monthNum ? new Date(`${year}-${monthNum}-01`) : null;
}

/**
 * Split and clean comma-separated names
 * Example: "John Doe, Jane Smith" -> ["John Doe", "Jane Smith"]
 */
function splitNames(namesStr: string): string[] {
  if (!namesStr || namesStr.trim() === "") {
    return [];
  }

  return namesStr
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0 && name.toLowerCase() !== "undisclosed");
}

/**
 * Clean and normalize company name
 */
function cleanCompanyName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

// =====================================================
// Database Operations
// =====================================================

/**
 * Upsert startup and return its ID
 */
async function upsertStartup(startup: {
  name: string;
  foundingDate: Date | null;
  city: string;
  industry: string;
  subVertical: string;
}): Promise<string> {
  if (DRY_RUN || !sql) {
    return "dry-run-uuid";
  }

  const result = await sql`
    INSERT INTO startups (name, founding_date, city, industry, sub_vertical)
    VALUES (${startup.name}, ${startup.foundingDate}, ${startup.city}, ${startup.industry}, ${startup.subVertical})
    ON CONFLICT (name) 
    DO UPDATE SET
      founding_date = COALESCE(EXCLUDED.founding_date, startups.founding_date),
      city = COALESCE(EXCLUDED.city, startups.city),
      industry = COALESCE(EXCLUDED.industry, startups.industry),
      sub_vertical = COALESCE(EXCLUDED.sub_vertical, startups.sub_vertical),
      updated_at = NOW()
    RETURNING id
  `;

  return result[0].id;
}

/**
 * Upsert founder and return its ID
 */
async function upsertFounder(name: string): Promise<string> {
  if (DRY_RUN || !sql) {
    return "dry-run-uuid";
  }

  const result = await sql`
    INSERT INTO founders (name)
    VALUES (${name})
    ON CONFLICT (name) DO NOTHING
    RETURNING id
  `;

  if (result.length > 0) {
    return result[0].id;
  }

  // If conflict occurred, fetch existing ID
  const existing = await sql`SELECT id FROM founders WHERE name = ${name}`;
  return existing[0].id;
}

/**
 * Upsert investor and return its ID
 */
async function upsertInvestor(name: string): Promise<string> {
  if (DRY_RUN || !sql) {
    return "dry-run-uuid";
  }

  const result = await sql`
    INSERT INTO investors (name)
    VALUES (${name})
    ON CONFLICT (name) DO NOTHING
    RETURNING id
  `;

  if (result.length > 0) {
    return result[0].id;
  }

  // If conflict occurred, fetch existing ID
  const existing = await sql`SELECT id FROM investors WHERE name = ${name}`;
  return existing[0].id;
}

/**
 * Link founder to startup
 */
async function linkFounderToStartup(
  startupId: string,
  founderId: string,
): Promise<void> {
  if (DRY_RUN || !sql) {
    return;
  }

  await sql`
    INSERT INTO startup_founders (startup_id, founder_id)
    VALUES (${startupId}, ${founderId})
    ON CONFLICT (startup_id, founder_id) DO NOTHING
  `;
}

/**
 * Insert funding round
 */
async function insertFundingRound(fundingRound: {
  startupId: string;
  investorId: string;
  amountUsd: number | null;
  investmentStage: string;
  fundingDate: Date | null;
  sourceFile: string;
}): Promise<void> {
  if (DRY_RUN || !sql) {
    return;
  }

  await sql`
    INSERT INTO funding_rounds (startup_id, investor_id, amount_usd, investment_stage, funding_date, source_file)
    VALUES (
      ${fundingRound.startupId},
      ${fundingRound.investorId},
      ${fundingRound.amountUsd},
      ${fundingRound.investmentStage},
      ${fundingRound.fundingDate},
      ${fundingRound.sourceFile}
    )
  `;
}

// =====================================================
// CSV Processing
// =====================================================

/**
 * Process a single CSV file
 */
async function processCSVFile(
  filePath: string,
  stats: MigrationStats,
): Promise<void> {
  const filename = path.basename(filePath);
  const fundingDate = extractFundingDate(filename);

  console.log(`\n📄 Processing: ${filename}`);

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = Papa.parse<CSVRow>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`   Found ${parsed.data.length} rows`);

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const rowNum = i + 2; // +2 for header and 1-indexed

    try {
      // Skip rows with no company name
      if (!row["Startup Name"] || row["Startup Name"].trim() === "") {
        continue;
      }

      // Parse row data
      const companyName = cleanCompanyName(row["Startup Name"]);
      const foundingDate = parseDate(row["Founding Date"]);
      const city = row["City"]?.trim() || "";
      const industry = row["Industry/Vertical"]?.trim() || "";
      const subVertical = row["Sub-Vertical"]?.trim() || "";
      const founderNames = splitNames(row["Founders"]);
      const investorNames = splitNames(row["Investors"]);
      const amount = parseAmount(row["Amount(in USD)"]);
      const stage = row["Investment Stage"]?.trim() || "";

      // Upsert startup
      const startupId = await upsertStartup({
        name: companyName,
        foundingDate,
        city,
        industry,
        subVertical,
      });
      stats.startupsInserted++;

      // Upsert and link founders
      for (const founderName of founderNames) {
        const founderId = await upsertFounder(founderName);
        await linkFounderToStartup(startupId, founderId);
        stats.foundersInserted++;
      }

      // Upsert investors and create funding rounds
      for (const investorName of investorNames) {
        const investorId = await upsertInvestor(investorName);
        stats.investorsInserted++;

        await insertFundingRound({
          startupId,
          investorId,
          amountUsd: amount,
          investmentStage: stage,
          fundingDate,
          sourceFile: filename,
        });
        stats.fundingRoundsInserted++;
      }

      stats.rowsProcessed++;

      // Progress indicator
      if (stats.rowsProcessed % 50 === 0) {
        console.log(`   ✓ Processed ${stats.rowsProcessed} rows...`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      stats.errors.push({
        file: filename,
        row: rowNum,
        error: errorMsg,
      });
      console.error(`   ⚠️  Error on row ${rowNum}: ${errorMsg}`);
    }
  }

  stats.filesProcessed++;
  console.log(`   ✅ Completed: ${filename}`);
}

/**
 * Process all CSV files in specified directories
 */
async function processAllCSVFiles(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    filesProcessed: 0,
    rowsProcessed: 0,
    startupsInserted: 0,
    startupsUpdated: 0,
    foundersInserted: 0,
    investorsInserted: 0,
    fundingRoundsInserted: 0,
    errors: [],
  };

  for (const dir of DATA_DIRS) {
    const dirPath = path.join(process.cwd(), dir);

    if (!fs.existsSync(dirPath)) {
      console.warn(`⚠️  Directory not found: ${dir}`);
      continue;
    }

    const files = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith(".csv"))
      .sort();

    console.log(`\n📁 Processing directory: ${dir} (${files.length} files)`);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      await processCSVFile(filePath, stats);
    }
  }

  return stats;
}

// =====================================================
// Main Execution
// =====================================================

async function main() {
  console.log("=".repeat(60));
  console.log("🚀 CSV to Supabase Migration Script");
  console.log("=".repeat(60));

  if (DRY_RUN) {
    console.log("🔍 DRY RUN MODE - No data will be inserted\n");
  } else {
    console.log("💾 LIVE MODE - Data will be inserted into database\n");
  }

  const startTime = Date.now();

  try {
    // Test database connection
    if (!DRY_RUN && sql) {
      console.log("🔌 Testing database connection...");
      await sql`SELECT 1`;
      console.log("✅ Database connection successful\n");
    }

    // Process all CSV files
    const stats = await processAllCSVFiles();

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary");
    console.log("=".repeat(60));
    console.log(`Files processed:       ${stats.filesProcessed}`);
    console.log(`Rows processed:        ${stats.rowsProcessed}`);
    console.log(`Startups inserted:     ${stats.startupsInserted}`);
    console.log(`Founders inserted:     ${stats.foundersInserted}`);
    console.log(`Investors inserted:    ${stats.investorsInserted}`);
    console.log(`Funding rounds:        ${stats.fundingRoundsInserted}`);
    console.log(`Errors:                ${stats.errors.length}`);

    if (stats.errors.length > 0) {
      console.log("\n⚠️  Errors encountered:");
      stats.errors.slice(0, 10).forEach((err) => {
        console.log(`   ${err.file}:${err.row} - ${err.error}`);
      });
      if (stats.errors.length > 10) {
        console.log(`   ... and ${stats.errors.length - 10} more errors`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Total time: ${duration}s`);
    console.log("=".repeat(60));

    if (DRY_RUN) {
      console.log("\n✅ Dry run completed successfully!");
      console.log("💡 Run without --dry-run flag to insert data");
    } else {
      console.log("\n✅ Migration completed successfully!");
    }
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    // Close database connection
    if (sql) {
      await sql.end();
    }
  }
}

// Run the migration
main();
