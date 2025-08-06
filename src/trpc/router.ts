import { authRouter } from "./routers/auth";
import { providersRouter } from "./routers/providers";
import { router } from "./trpc";

export const appRouter = router({
	auth: authRouter,
	providers: providersRouter,
});
export type AppRouter = typeof appRouter;
