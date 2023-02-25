import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const raiseRouter = router({
  customPathCheck: publicProcedure
    .input(z.string().min(3).max(15).transform( t => t.toLowerCase() ))
    .query(async ({ ctx, input }) => {
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