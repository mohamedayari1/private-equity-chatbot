import { ilike } from "drizzle-orm";
import { db } from "../index";
import { investors } from "../schema";

export const getInvestorByName = async (name: string) => {
  return await db
    .select()
    .from(investors)
    .where(ilike(investors.name, `%${name}%`));
};

export const getAllInvestors = async (limit = 10) => {
  return await db.select().from(investors).limit(limit);
};
