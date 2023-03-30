import { PrismaClient } from "@prisma/client";
import { Kysely } from "kysely";
import type { DB } from "./types";

import { env } from "../../env/server.mjs";
import { PlanetScaleDialect } from "kysely-planetscale";
import { cast, type Field } from "@planetscale/database";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

function inflate(field: Field, value: string  | null) {
  if ((field.type === 'INT64' || field.type === 'UINT64') && !!value) {
    return BigInt(value)
  }
  return cast(field, value)
}

export const ps = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL_PS,
    cast: inflate
  })
})
