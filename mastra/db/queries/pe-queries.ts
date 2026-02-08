/**
 * PE-Focused Database Queries
 *
 * Centralized queries optimized for Private Equity analyst workflows.
 * Uses raw SQL for complex joins and aggregations that leverage
 * the database views (startup_profiles, investor_portfolios).
 */

import { ilike, sql } from "drizzle-orm";
import { db } from "../index";
import { investors, startups } from "../schema";

// =====================================================
// Startup Queries
// =====================================================

/**
 * Get comprehensive startup profile with founders, investors, and funding
 * Uses fuzzy matching on company name
 */
export async function getStartupProfile(companyName: string) {
  // Try exact match first, then fuzzy
  const results = await db.execute(sql`
    SELECT 
      s.id,
      s.name,
      s.founding_date,
      s.city,
      s.industry,
      s.sub_vertical,
      ARRAY_AGG(DISTINCT f.name) FILTER (WHERE f.name IS NOT NULL) as founders,
      ARRAY_AGG(DISTINCT i.name) FILTER (WHERE i.name IS NOT NULL) as investors,
      COUNT(DISTINCT fr.id) as funding_rounds_count,
      COALESCE(SUM(fr.amount_usd), 0) as total_raised_usd,
      MAX(fr.funding_date) as last_funding_date,
      MAX(fr.investment_stage) as last_investment_stage
    FROM startups s
    LEFT JOIN startup_founders sf ON s.id = sf.startup_id
    LEFT JOIN founders f ON sf.founder_id = f.id
    LEFT JOIN funding_rounds fr ON s.id = fr.startup_id
    LEFT JOIN investors i ON fr.investor_id = i.id
    WHERE LOWER(s.name) LIKE LOWER(${`%${companyName}%`})
    GROUP BY s.id
    LIMIT 5
  `);

  return results;
}

/**
 * Search startups by name with fuzzy matching
 */
export async function searchStartups(searchTerm: string, limit = 10) {
  return await db
    .select()
    .from(startups)
    .where(ilike(startups.name, `%${searchTerm}%`))
    .limit(limit);
}

// =====================================================
// Investor Queries
// =====================================================

/**
 * Get investor portfolio with all their investments
 */
export async function getInvestorPortfolio(investorName: string) {
  const results = await db.execute(sql`
    SELECT 
      i.id,
      i.name as investor_name,
      COUNT(DISTINCT fr.startup_id) as companies_invested,
      COALESCE(SUM(fr.amount_usd), 0) as total_invested_usd,
      ARRAY_AGG(DISTINCT s.industry) FILTER (WHERE s.industry IS NOT NULL) as industries,
      ARRAY_AGG(DISTINCT fr.investment_stage) FILTER (WHERE fr.investment_stage IS NOT NULL) as stages,
      MIN(fr.funding_date) as first_investment_date,
      MAX(fr.funding_date) as last_investment_date
    FROM investors i
    LEFT JOIN funding_rounds fr ON i.id = fr.investor_id
    LEFT JOIN startups s ON fr.startup_id = s.id
    WHERE LOWER(i.name) LIKE LOWER(${`%${investorName}%`})
    GROUP BY i.id
    LIMIT 5
  `);

  return results;
}

/**
 * Get portfolio companies for a specific investor
 */
export async function getInvestorCompanies(investorName: string) {
  const results = await db.execute(sql`
    SELECT 
      s.name as company_name,
      s.industry,
      s.sub_vertical,
      s.city,
      fr.investment_stage,
      fr.amount_usd,
      fr.funding_date
    FROM funding_rounds fr
    JOIN investors i ON fr.investor_id = i.id
    JOIN startups s ON fr.startup_id = s.id
    WHERE LOWER(i.name) LIKE LOWER(${`%${investorName}%`})
    ORDER BY fr.funding_date DESC
  `);

  return results;
}

/**
 * Search investors by name
 */
export async function searchInvestors(searchTerm: string, limit = 10) {
  return await db
    .select()
    .from(investors)
    .where(ilike(investors.name, `%${searchTerm}%`))
    .limit(limit);
}

// =====================================================
// Market Mapping Queries
// =====================================================

/**
 * Get market map for a specific industry/sector
 * Returns sub-sector breakdown with funding and company counts
 */
export async function getMarketMap(industry: string) {
  const results = await db.execute(sql`
    SELECT 
      s.sub_vertical,
      s.industry,
      COUNT(DISTINCT s.id) as company_count,
      COALESCE(SUM(fr.amount_usd), 0) as total_funding,
      COALESCE(AVG(fr.amount_usd), 0) as avg_funding,
      COUNT(DISTINCT fr.investor_id) as investor_count,
      ARRAY_AGG(DISTINCT s.name ORDER BY s.name) FILTER (WHERE s.name IS NOT NULL) as companies
    FROM startups s
    LEFT JOIN funding_rounds fr ON s.id = fr.startup_id
    WHERE LOWER(s.industry) LIKE LOWER(${`%${industry}%`})
    GROUP BY s.sub_vertical, s.industry
    ORDER BY total_funding DESC
  `);

  return results;
}

/**
 * Get top companies in a sector by funding
 */
export async function getTopCompaniesBySector(industry: string, limit = 10) {
  const results = await db.execute(sql`
    SELECT 
      s.name,
      s.sub_vertical,
      s.city,
      COALESCE(SUM(fr.amount_usd), 0) as total_raised,
      MAX(fr.investment_stage) as last_stage,
      COUNT(fr.id) as round_count
    FROM startups s
    LEFT JOIN funding_rounds fr ON s.id = fr.startup_id
    WHERE LOWER(s.industry) LIKE LOWER(${`%${industry}%`})
    GROUP BY s.id
    ORDER BY total_raised DESC
    LIMIT ${limit}
  `);

  return results;
}

/**
 * Get list of unique industries in the database
 */
export async function getUniqueIndustries() {
  const results = await db.execute(sql`
    SELECT DISTINCT industry, COUNT(*) as company_count
    FROM startups
    WHERE industry IS NOT NULL AND industry != ''
    GROUP BY industry
    ORDER BY company_count DESC
  `);

  return results;
}

// =====================================================
// Funding Analysis Queries
// =====================================================

/**
 * Get funding trends over time
 * Can filter by sector or return all
 */
export async function getFundingTrends(options?: {
  industry?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { industry, startDate, endDate } = options || {};

  const results = await db.execute(sql`
    SELECT 
      DATE_TRUNC('month', fr.funding_date) as period,
      COUNT(*) as deal_count,
      COALESCE(SUM(fr.amount_usd), 0) as total_amount,
      COALESCE(AVG(fr.amount_usd), 0) as avg_amount,
      COUNT(DISTINCT fr.startup_id) as unique_companies,
      COUNT(DISTINCT fr.investor_id) as unique_investors
    FROM funding_rounds fr
    LEFT JOIN startups s ON fr.startup_id = s.id
    WHERE fr.funding_date IS NOT NULL
      ${industry ? sql`AND LOWER(s.industry) LIKE LOWER(${`%${industry}%`})` : sql``}
      ${startDate ? sql`AND fr.funding_date >= ${startDate}::date` : sql``}
      ${endDate ? sql`AND fr.funding_date <= ${endDate}::date` : sql``}
    GROUP BY DATE_TRUNC('month', fr.funding_date)
    ORDER BY period DESC
  `);

  return results;
}

/**
 * Get funding by investment stage
 */
export async function getFundingByStage(industry?: string) {
  const results = await db.execute(sql`
    SELECT 
      fr.investment_stage,
      COUNT(*) as deal_count,
      COALESCE(SUM(fr.amount_usd), 0) as total_amount,
      COALESCE(AVG(fr.amount_usd), 0) as avg_amount
    FROM funding_rounds fr
    LEFT JOIN startups s ON fr.startup_id = s.id
    WHERE fr.investment_stage IS NOT NULL AND fr.investment_stage != ''
      ${industry ? sql`AND LOWER(s.industry) LIKE LOWER(${`%${industry}%`})` : sql``}
    GROUP BY fr.investment_stage
    ORDER BY total_amount DESC
  `);

  return results;
}

/**
 * Get company funding history
 */
export async function getCompanyFundingHistory(companyName: string) {
  const results = await db.execute(sql`
    SELECT 
      fr.funding_date,
      fr.investment_stage,
      fr.amount_usd,
      i.name as investor_name
    FROM funding_rounds fr
    JOIN startups s ON fr.startup_id = s.id
    JOIN investors i ON fr.investor_id = i.id
    WHERE LOWER(s.name) LIKE LOWER(${`%${companyName}%`})
    ORDER BY fr.funding_date ASC
  `);

  return results;
}

/**
 * Get overall funding statistics
 */
export async function getFundingStats() {
  const results = await db.execute(sql`
    SELECT 
      COUNT(*) as total_rounds,
      COUNT(DISTINCT startup_id) as total_companies,
      COUNT(DISTINCT investor_id) as total_investors,
      COALESCE(SUM(amount_usd), 0) as total_funding,
      COALESCE(AVG(amount_usd), 0) as avg_round_size,
      MIN(funding_date) as earliest_date,
      MAX(funding_date) as latest_date
    FROM funding_rounds
  `);

  return results[0];
}
