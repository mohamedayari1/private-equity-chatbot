import { relations } from "drizzle-orm";
import {
  date,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// =====================================================
// Core Tables - Matching scripts/db/schema.sql
// =====================================================

/**
 * Startups/Companies table
 * Core company/startup information
 */
export const startups = pgTable("startups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  foundingDate: date("founding_date"),
  city: text("city"),
  industry: text("industry"),
  subVertical: text("sub_vertical"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

/**
 * Founders table
 * Founder information (normalized to prevent duplicates)
 */
export const founders = pgTable("founders", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * Investors table
 * Investor information (normalized to prevent duplicates)
 */
export const investors = pgTable("investors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// =====================================================
// Relationship Tables
// =====================================================

/**
 * Many-to-many: Startups <-> Founders
 */
export const startupFounders = pgTable(
  "startup_founders",
  {
    startupId: uuid("startup_id")
      .notNull()
      .references(() => startups.id, { onDelete: "cascade" }),
    founderId: uuid("founder_id")
      .notNull()
      .references(() => founders.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.startupId, table.founderId] })],
);

/**
 * Funding rounds (links startups and investors)
 * Individual funding transactions/rounds
 */
export const fundingRounds = pgTable("funding_rounds", {
  id: uuid("id").defaultRandom().primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  investorId: uuid("investor_id")
    .notNull()
    .references(() => investors.id, { onDelete: "cascade" }),
  amountUsd: numeric("amount_usd", { precision: 15, scale: 2 }),
  investmentStage: text("investment_stage"),
  fundingDate: date("funding_date"),
  sourceFile: text("source_file"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// =====================================================
// Relations (for Drizzle query builder)
// =====================================================

export const startupsRelations = relations(startups, ({ many }) => ({
  fundingRounds: many(fundingRounds),
  startupFounders: many(startupFounders),
}));

export const foundersRelations = relations(founders, ({ many }) => ({
  startupFounders: many(startupFounders),
}));

export const investorsRelations = relations(investors, ({ many }) => ({
  fundingRounds: many(fundingRounds),
}));

export const startupFoundersRelations = relations(
  startupFounders,
  ({ one }) => ({
    startup: one(startups, {
      fields: [startupFounders.startupId],
      references: [startups.id],
    }),
    founder: one(founders, {
      fields: [startupFounders.founderId],
      references: [founders.id],
    }),
  }),
);

export const fundingRoundsRelations = relations(fundingRounds, ({ one }) => ({
  startup: one(startups, {
    fields: [fundingRounds.startupId],
    references: [startups.id],
  }),
  investor: one(investors, {
    fields: [fundingRounds.investorId],
    references: [investors.id],
  }),
}));
