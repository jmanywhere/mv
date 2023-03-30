import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { isAddress } from "ethers/lib/utils.js";
import { sql } from 'kysely'

export const raiseRouter = router({
  customPathCheck: publicProcedure
    .input(z.string().min(3).max(15).transform( t => t.toLowerCase() ))
    .query(async ({ ctx, input }) => {
      if(isAddress(input))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Address is not a valid route name"
        })

      const queryValue = await ctx.ps.selectFrom("Upsell").selectAll().where(sql`LOWER(routeName) = ${input}`).executeTakeFirst()
      return !!queryValue
    })
})