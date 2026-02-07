import { ilike } from "drizzle-orm";
import { db } from "../index";
import { startups } from "../schema";

export const getStartupByName = async (name: string) => {
  return await db
    .select()
    .from(startups)
    .where(ilike(startups.name, `%${name}%`));
};

export const getAllStartups = async (limit = 10) => {
  return await db.select().from(startups).limit(limit);
};
