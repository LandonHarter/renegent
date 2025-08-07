import { authRouter } from "./routers/auth";
import { keysRouter } from "./routers/keys";
import { providersRouter } from "./routers/providers";
import { modelsRouter } from "./routers/models";
import { router } from "./trpc";

export const appRouter = router({
	auth: authRouter,
	providers: providersRouter,
	keys: keysRouter,
	models: modelsRouter,
});
export type AppRouter = typeof appRouter;
