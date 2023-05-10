import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { isAddress } from 'ethers/lib/utils.js';
import { sql } from 'kysely';

export const adminRouter = router({
  createChain: publicProcedure //this needs to be a protected procedure
    .input(z.object({

    }))
    .mutation( async ({ctx, input}) => {
      return 'create Chain'
    })
})