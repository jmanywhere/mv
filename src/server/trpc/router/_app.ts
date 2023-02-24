import { router } from "../trpc";
import { exampleRouter } from "./example";
import { mediaRouter } from "./media";
import { raiseRouter } from "./raise";

export const appRouter = router({
  example: exampleRouter,
  media: mediaRouter,
  raise: raiseRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
