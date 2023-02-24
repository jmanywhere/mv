import { router } from "../trpc";
import { exampleRouter } from "./example";
import { mediaRouter } from "./media";

export const appRouter = router({
  example: exampleRouter,
  media: mediaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
