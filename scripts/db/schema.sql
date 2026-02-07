-- =====================================================
-- PE Deal Data Schema for Supabase
-- =====================================================
-- This schema stores startup funding data from CSV files
-- Normalized design for efficient querying and data integrity
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Core Tables
-- =====================================================

-- Startups/Companies table
CREATE TABLE IF NOT EXISTS startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    founding_date DATE,
    city TEXT,
    industry TEXT,
    sub_vertical TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founders table
CREATE TABLE IF NOT EXISTS founders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investors table
CREATE TABLE IF NOT EXISTS investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Relationship Tables
-- =====================================================

-- Many-to-many: Startups <-> Founders
CREATE TABLE IF NOT EXISTS startup_founders (
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    founder_id UUID NOT NULL REFERENCES founders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (startup_id, founder_id)
);

-- Funding rounds (links startups and investors)
CREATE TABLE IF NOT EXISTS funding_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
    amount_usd NUMERIC(15, 2),
    investment_stage TEXT,
    funding_date DATE,
    source_file TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Startup indexes
CREATE INDEX IF NOT EXISTS idx_startups_name ON startups(name);
CREATE INDEX IF NOT EXISTS idx_startups_industry ON startups(industry);
CREATE INDEX IF NOT EXISTS idx_startups_city ON startups(city);

-- Founder indexes
CREATE INDEX IF NOT EXISTS idx_founders_name ON founders(name);

-- Investor indexes
CREATE INDEX IF NOT EXISTS idx_investors_name ON investors(name);

-- Funding round indexes
CREATE INDEX IF NOT EXISTS idx_funding_rounds_startup ON funding_rounds(startup_id);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_investor ON funding_rounds(investor_id);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_stage ON funding_rounds(investment_stage);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_date ON funding_rounds(funding_date);

-- Startup founders indexes
CREATE INDEX IF NOT EXISTS idx_startup_founders_startup ON startup_founders(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_founders_founder ON startup_founders(founder_id);

-- =====================================================
-- Helpful Views
-- =====================================================

-- View: Complete startup profile with aggregated data
CREATE OR REPLACE VIEW startup_profiles AS
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
    SUM(fr.amount_usd) as total_raised_usd,
    MAX(fr.funding_date) as last_funding_date,
    MAX(fr.investment_stage) as last_investment_stage
FROM startups s
LEFT JOIN startup_founders sf ON s.id = sf.startup_id
LEFT JOIN founders f ON sf.founder_id = f.id
LEFT JOIN funding_rounds fr ON s.id = fr.startup_id
LEFT JOIN investors i ON fr.investor_id = i.id
GROUP BY s.id;

-- View: Investor portfolio summary
CREATE OR REPLACE VIEW investor_portfolios AS
SELECT 
    i.id,
    i.name as investor_name,
    COUNT(DISTINCT fr.startup_id) as companies_invested,
    SUM(fr.amount_usd) as total_invested_usd,
    ARRAY_AGG(DISTINCT s.industry) FILTER (WHERE s.industry IS NOT NULL) as industries,
    MIN(fr.funding_date) as first_investment_date,
    MAX(fr.funding_date) as last_investment_date
FROM investors i
LEFT JOIN funding_rounds fr ON i.id = fr.investor_id
LEFT JOIN startups s ON fr.startup_id = s.id
GROUP BY i.id;

-- =====================================================
-- Functions
-- =====================================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on startups table
DROP TRIGGER IF EXISTS update_startups_updated_at ON startups;
CREATE TRIGGER update_startups_updated_at
    BEFORE UPDATE ON startups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE startups IS 'Core company/startup information';
COMMENT ON TABLE founders IS 'Founder information (normalized to prevent duplicates)';
COMMENT ON TABLE investors IS 'Investor information (normalized to prevent duplicates)';
COMMENT ON TABLE startup_founders IS 'Many-to-many relationship between startups and founders';
COMMENT ON TABLE funding_rounds IS 'Individual funding transactions/rounds';

COMMENT ON COLUMN funding_rounds.amount_usd IS 'Investment amount in USD (NULL for undisclosed amounts)';
COMMENT ON COLUMN funding_rounds.source_file IS 'CSV filename where this data originated';
COMMENT ON COLUMN funding_rounds.funding_date IS 'Date of funding (derived from CSV filename month/year)';
