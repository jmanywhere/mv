import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { isAddress } from "ethers/lib/utils.js";

export const raiseRouter = router({
  customPathCheck: publicProcedure
    .input(z.string().min(3).max(15).transform( t => t.toLowerCase() ))
    .query(async ({ ctx, input }) => {
      if(isAddress(input))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Address is not a valid route name"
        })
      return (await ctx.prisma.upsell.count({
        where: {
          routeName: {
            equals: input,
            mode: "insensitive"
          }
        }
      })) > 0
    })
})