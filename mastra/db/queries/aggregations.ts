import { sql } from "drizzle-orm";
import { db } from "../index";
import { fundingRounds } from "../schema";

export const getFundingStats = async () => {
  return await db.execute(
    sql`SELECT count(*) as total_rounds FROM ${fundingRounds}`,
  );
};
