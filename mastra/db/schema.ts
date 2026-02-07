import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Placeholder schema - replace with actual schema
export const startups = pgTable("startups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  industry: text("industry"),
  location: text("location"),
  foundedYear: integer("founded_year"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investors = pgTable("investors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type"),
  focusAreas: text("focus_areas"),
  assetsUnderManagement: text("assets_under_management"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fundingRounds = pgTable("funding_rounds", {
  id: uuid("id").defaultRandom().primaryKey(),
  startupId: uuid("startup_id").references(() => startups.id),
  roundName: text("round_name"),
  amount: text("amount"),
  date: timestamp("date"),
  investors: text("investors"), // JSON or array string
  createdAt: timestamp("created_at").defaultNow(),
});
